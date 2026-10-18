/**
 * WT2003H4-16S UART 控制（TF/SD 卡）
 *
 * 硬體（Sheet_1.net）：
 *   micro:bit P16 → U4.6 PA0/RX（模組收）
 *   micro:bit P15 ← U4.16 TX（模組發）
 *   TF 卡 DAT/CMD/CLK 直接接 U4，micro:bit 唔使 bit-bang SD
 *
 * 協議（Waytronic，9600 8N1）：
 *   幀：7E | LEN | CMD | PARAM... | CHECKSUM | EF
 *   LEN = length + cmd + params + checksum 嘅位元組數
 *   CHECKSUM = (LEN + CMD + PARAM...) 累加和低字節
 *
 * TF 播放用 A2（SD 版）；唔好用 Flash 版 A0。
 */
//% color="#3498DB" icon="\uf001" block="戰鬥盤-音樂"
namespace StemBattleMusic {
    let ready = false
    const BAUD = BaudRate.BaudRate9600

    /**
     * 初始化 UART（9600）接 WT2003
     */
    //% block="初始化 SD 音樂模組"
    //% weight=100
    export function init(): void {
        // TX=P16 → 模組 RX；RX=P15 ← 模組 TX
        serial.redirect(StemBattlePins.WT_TX, StemBattlePins.WT_RX, BAUD)
        serial.setRxBufferSize(64)
        basic.pause(200)
        ready = true
        setVolume(20)
    }

    function ensure(): void {
        if (!ready) init()
    }

    function checksum(bytes: number[]): number {
        let sum = 0
        for (let i = 0; i < bytes.length; i++) {
            sum += bytes[i]
        }
        return sum & 0xff
    }

    /** 發送完整命令幀 */
    function sendFrame(cmd: number, params: number[]): void {
        ensure()
        // LEN = 1(len) + 1(cmd) + params.length + 1(checksum)
        const len = 2 + params.length + 1
        const body: number[] = [len, cmd]
        for (let i = 0; i < params.length; i++) {
            body.push(params[i] & 0xff)
        }
        const chk = checksum(body)
        const buf = pins.createBuffer(2 + body.length + 1)
        // 7E + body + chk + EF
        let o = 0
        buf.setNumber(NumberFormat.UInt8LE, o++, 0x7e)
        for (let i = 0; i < body.length; i++) {
            buf.setNumber(NumberFormat.UInt8LE, o++, body[i])
        }
        buf.setNumber(NumberFormat.UInt8LE, o++, chk)
        buf.setNumber(NumberFormat.UInt8LE, o++, 0xef)
        serial.writeBuffer(buf)
        basic.pause(30)
    }

    /**
     * 按索引播放 TF 卡根目錄曲目（A2）
     * 索引由 1 起；順序=拷入 TF 嘅時間順序，唔係檔名排序
     * @param index 曲目編號，由 1 開始
     */
    //% block="播放第 %index 首"
    //% index.defl=1 index.min=1 index.max=9999
    //% weight=90
    export function playByIndex(index: number): void {
        const hi = (index >> 8) & 0xff
        const lo = index & 0xff
        // 7E 05 A2 hh ll XX EF
        sendFrame(0xa2, [hi, lo])
    }

    /**
     * 用 4 字元檔名播放（A3），例如 "0001" → 0001.mp3
     * @param name4 剛好 4 個 ASCII 字元（唔包副檔名）
     */
    //% block="播放檔名 %name4 （4字）"
    //% name4.defl="0001"
    //% weight=85
    export function playByName(name4: string): void {
        const s = (name4 + "0000").slice(0, 4)
        sendFrame(0xa3, [
            s.charCodeAt(0),
            s.charCodeAt(1),
            s.charCodeAt(2),
            s.charCodeAt(3)
        ])
    }

    /**
     * 停止播放（AB）
     */
    //% block="停止音樂"
    //% weight=80
    export function stop(): void {
        sendFrame(0xab, [])
    }

    /**
     * 暫停／繼續（AA）
     */
    //% block="暫停或繼續"
    //% weight=75
    export function pauseToggle(): void {
        sendFrame(0xaa, [])
    }

    /**
     * 下一首（AC）
     */
    //% block="下一首"
    //% weight=70
    export function next(): void {
        sendFrame(0xac, [])
    }

    /**
     * 上一首（AD）
     */
    //% block="上一首"
    //% weight=65
    export function prev(): void {
        sendFrame(0xad, [])
    }

    /**
     * 設定音量 0–31（AE；0=靜音，31=最大）
     * @param level 0–31
     */
    //% block="設定音量 %level"
    //% level.defl=20 level.min=0 level.max=31
    //% weight=60
    export function setVolume(level: number): void {
        let v = level | 0
        if (v < 0) v = 0
        if (v > 31) v = 31
        sendFrame(0xae, [v])
    }

    /**
     * 播放模式（AF）
     * 0=單曲不循環 1=單曲循環 2=全部循環 3=隨機
     */
    //% block="播放模式 %mode"
    //% mode.defl=0 mode.min=0 mode.max=3
    //% weight=50
    export function setPlayMode(mode: number): void {
        sendFrame(0xaf, [mode & 0x03])
    }
}
