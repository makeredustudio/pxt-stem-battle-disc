/**
 * 外接 NFC（PN532 I2C）薄封裝
 *
 * 重要：v1 PCB 板上 U2 係 I2C EEPROM（唔係 NFC）。
 * 請將 PN532（I2C 模式）插去 H7：GND / VCC / SDA / SCL。
 * 預設 I2C 地址 0x24。
 */
//% color="#E74C3C" icon="\uf2c2" block="戰鬥盤-NFC"
namespace StemBattleNFC {
    const ADDR = 0x24
    let inited = false

    function writeFrame(data: number[]): void {
        // PN532 I2C：前置 0x00，再 preamble + start + len + lcs + tfi + data + dcs + postamble
        const tfi = 0xd4
        const len = data.length + 1 // + TFI
        const lcs = (~len + 1) & 0xff
        let sum = tfi
        for (let i = 0; i < data.length; i++) sum += data[i]
        const dcs = (~sum + 1) & 0xff

        const pkt: number[] = [0x00, 0x00, 0xff, len, lcs, tfi]
        for (let i = 0; i < data.length; i++) pkt.push(data[i])
        pkt.push(dcs)
        pkt.push(0x00)

        const buf = pins.createBuffer(pkt.length)
        for (let i = 0; i < pkt.length; i++) {
            buf.setNumber(NumberFormat.UInt8LE, i, pkt[i])
        }
        pins.i2cWriteBuffer(ADDR, buf, false)
    }

    function readAck(): boolean {
        basic.pause(5)
        const r = pins.i2cReadBuffer(ADDR, 7, false)
        // 期望：01 00 00 FF 00 FF 00 （ready + ACK）
        if (!r || r.length < 7) return false
        return r.getNumber(NumberFormat.UInt8LE, 0) == 0x01
    }

    function readResponse(maxLen: number): Buffer {
        basic.pause(20)
        // 先讀 ready 位
        let ready = pins.i2cReadBuffer(ADDR, 1, false)
        let tries = 0
        while ((!ready || ready.getNumber(NumberFormat.UInt8LE, 0) != 0x01) && tries < 20) {
            basic.pause(10)
            ready = pins.i2cReadBuffer(ADDR, 1, false)
            tries++
        }
        return pins.i2cReadBuffer(ADDR, maxLen, false)
    }

    /**
     * 初始化外接 PN532（I2C）
     * 若板無 NFC 模組，呼叫後讀 UID 會回空字串
     */
    //% block="初始化外接 NFC"
    //% weight=100
    export function init(): void {
        // SAMConfiguration：normal mode
        writeFrame([0x14, 0x01, 0x00, 0x00])
        readAck()
        readResponse(16)
        inited = true
    }

    function ensure(): void {
        if (!inited) init()
    }

    /**
     * 讀卡片 UID（十六進位字串）；無卡或無模組回 ""
     */
    //% block="讀取 NFC UID"
    //% weight=90
    export function readUID(): string {
        ensure()
        // InListPassiveTarget：max 1, 106kbps type A
        writeFrame([0x4a, 0x01, 0x00])
        if (!readAck()) return ""
        const resp = readResponse(32)
        if (!resp || resp.length < 14) return ""
        // 粗略解析：搵長度同 UID
        // I2C 回應：01 | 00 00 FF LEN LCS | D5 4B ...
        let offset = -1
        for (let i = 0; i < resp.length - 2; i++) {
            if (
                resp.getNumber(NumberFormat.UInt8LE, i) == 0xd5 &&
                resp.getNumber(NumberFormat.UInt8LE, i + 1) == 0x4b
            ) {
                offset = i
                break
            }
        }
        if (offset < 0) return ""
        // D5 4B NbTg ... NFCID length at roughly offset+7 for type A single
        // 簡化：NbTg at offset+2；若 0 則無卡
        const nbtg = resp.getNumber(NumberFormat.UInt8LE, offset + 2)
        if (nbtg < 1) return ""
        // UID length typically at offset+7 (after Tg, SENS_RES×2, SEL_RES)
        const uidLen = resp.getNumber(NumberFormat.UInt8LE, offset + 7)
        if (uidLen < 4 || uidLen > 10) return ""
        let out = ""
        for (let i = 0; i < uidLen; i++) {
            const b = resp.getNumber(NumberFormat.UInt8LE, offset + 8 + i)
            const hex = "0123456789ABCDEF"
            out +=
                hex.charAt((b >> 4) & 0x0f) +
                hex.charAt(b & 0x0f)
        }
        return out
    }

    /**
     * 有冇讀到卡（UID 非空）
     */
    //% block="有 NFC 卡？"
    //% weight=80
    export function hasCard(): boolean {
        return readUID().length > 0
    }
}
