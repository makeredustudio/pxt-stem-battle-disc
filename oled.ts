/**
 * SSD1306 128×64 OLED（I2C，預設地址 0x3C）
 * 戰鬥盤 H7：GND / VCC / SDA(P20) / SCL(P19)
 * 內建輕量驅動，唔依賴額外 OLED 擴充
 */
//% color="#1ABC9C" icon="\uf108" block="戰鬥盤-OLED"
namespace StemBattleOLED {
    const ADDR = 0x3C
    const WIDTH = 128
    const HEIGHT = 64
    const PAGES = 8

    let buf: Buffer = null
    let inited = false

    function cmd1(c: number): void {
        const b = pins.createBuffer(2)
        b.setNumber(NumberFormat.UInt8LE, 0, 0x00)
        b.setNumber(NumberFormat.UInt8LE, 1, c)
        pins.i2cWriteBuffer(ADDR, b, false)
    }

    function cmdList(cmds: number[]): void {
        for (let i = 0; i < cmds.length; i++) {
            cmd1(cmds[i])
        }
    }

    /**
     * 初始化 OLED（SSD1306 128×64）
     */
    //% block="初始化 OLED"
    //% weight=100
    export function init(): void {
        basic.pause(50)
        cmdList([
            0xae, // display off
            0xd5, 0x80,
            0xa8, 0x3f,
            0xd3, 0x00,
            0x40,
            0x8d, 0x14, // charge pump
            0x20, 0x00, // horizontal addressing
            0xa1, // segment remap
            0xc8, // COM scan dec
            0xda, 0x12,
            0x81, 0xcf,
            0xd9, 0xf1,
            0xdb, 0x40,
            0xa4,
            0xa6, // normal
            0xaf  // display on
        ])
        buf = pins.createBuffer(WIDTH * PAGES)
        buf.fill(0)
        inited = true
        refresh()
    }

    function ensure(): void {
        if (!inited) init()
    }

    function setPos(col: number, page: number): void {
        cmd1(0xb0 | (page & 0x07))
        cmd1(0x00 | (col & 0x0f))
        cmd1(0x10 | ((col >> 4) & 0x0f))
    }

    /**
     * 把緩衝區送到螢幕
     */
    function refresh(): void {
        ensure()
        for (let page = 0; page < PAGES; page++) {
            setPos(0, page)
            // 一次寫一頁：控制字 0x40 + 128 bytes
            const chunk = pins.createBuffer(1 + WIDTH)
            chunk.setNumber(NumberFormat.UInt8LE, 0, 0x40)
            for (let x = 0; x < WIDTH; x++) {
                chunk.setNumber(
                    NumberFormat.UInt8LE,
                    1 + x,
                    buf.getNumber(NumberFormat.UInt8LE, page * WIDTH + x)
                )
            }
            pins.i2cWriteBuffer(ADDR, chunk, false)
        }
    }

    /**
     * 清屏
     */
    //% block="OLED 清屏"
    //% weight=90
    export function clear(): void {
        ensure()
        buf.fill(0)
        refresh()
    }

    function drawPixel(x: number, y: number, on: boolean): void {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
        const page = y >> 3
        const bit = y & 7
        const idx = page * WIDTH + x
        let v = buf.getNumber(NumberFormat.UInt8LE, idx)
        if (on) v = v | (1 << bit)
        else v = v & ~(1 << bit)
        buf.setNumber(NumberFormat.UInt8LE, idx, v)
    }

    // 5×7 簡易字型（只含常用 ASCII）
    const FONT: number[] = [
        0x00, 0x00, 0x00, 0x00, 0x00, // space
        0x00, 0x00, 0x5f, 0x00, 0x00, // !
        0x00, 0x07, 0x00, 0x07, 0x00, // "
        0x14, 0x7f, 0x14, 0x7f, 0x14, // #
        0x24, 0x2a, 0x7f, 0x2a, 0x12, // $
        0x23, 0x13, 0x08, 0x64, 0x62, // %
        0x36, 0x49, 0x55, 0x22, 0x50, // &
        0x00, 0x05, 0x03, 0x00, 0x00, // '
        0x00, 0x1c, 0x22, 0x41, 0x00, // (
        0x00, 0x41, 0x22, 0x1c, 0x00, // )
        0x14, 0x08, 0x3e, 0x08, 0x14, // *
        0x08, 0x08, 0x3e, 0x08, 0x08, // +
        0x00, 0x50, 0x30, 0x00, 0x00, // ,
        0x08, 0x08, 0x08, 0x08, 0x08, // -
        0x00, 0x60, 0x60, 0x00, 0x00, // .
        0x20, 0x10, 0x08, 0x04, 0x02, // /
        0x3e, 0x51, 0x49, 0x45, 0x3e, // 0
        0x00, 0x42, 0x7f, 0x40, 0x00, // 1
        0x42, 0x61, 0x51, 0x49, 0x46, // 2
        0x21, 0x41, 0x45, 0x4b, 0x31, // 3
        0x18, 0x14, 0x12, 0x7f, 0x10, // 4
        0x27, 0x45, 0x45, 0x45, 0x39, // 5
        0x3c, 0x4a, 0x49, 0x49, 0x30, // 6
        0x01, 0x71, 0x09, 0x05, 0x03, // 7
        0x36, 0x49, 0x49, 0x49, 0x36, // 8
        0x06, 0x49, 0x49, 0x29, 0x1e, // 9
        0x00, 0x36, 0x36, 0x00, 0x00, // :
        0x00, 0x56, 0x36, 0x00, 0x00, // ;
        0x08, 0x14, 0x22, 0x41, 0x00, // <
        0x14, 0x14, 0x14, 0x14, 0x14, // =
        0x00, 0x41, 0x22, 0x14, 0x08, // >
        0x02, 0x01, 0x51, 0x09, 0x06, // ?
        0x32, 0x49, 0x79, 0x41, 0x3e, // @
        0x7e, 0x11, 0x11, 0x11, 0x7e, // A
        0x7f, 0x49, 0x49, 0x49, 0x36, // B
        0x3e, 0x41, 0x41, 0x41, 0x22, // C
        0x7f, 0x41, 0x41, 0x22, 0x1c, // D
        0x7f, 0x49, 0x49, 0x49, 0x41, // E
        0x7f, 0x09, 0x09, 0x09, 0x01, // F
        0x3e, 0x41, 0x49, 0x49, 0x7a, // G
        0x7f, 0x08, 0x08, 0x08, 0x7f, // H
        0x00, 0x41, 0x7f, 0x41, 0x00, // I
        0x20, 0x40, 0x41, 0x3f, 0x01, // J
        0x7f, 0x08, 0x14, 0x22, 0x41, // K
        0x7f, 0x40, 0x40, 0x40, 0x40, // L
        0x7f, 0x02, 0x0c, 0x02, 0x7f, // M
        0x7f, 0x04, 0x08, 0x10, 0x7f, // N
        0x3e, 0x41, 0x41, 0x41, 0x3e, // O
        0x7f, 0x09, 0x09, 0x09, 0x06, // P
        0x3e, 0x41, 0x51, 0x21, 0x5e, // Q
        0x7f, 0x09, 0x19, 0x29, 0x46, // R
        0x46, 0x49, 0x49, 0x49, 0x31, // S
        0x01, 0x01, 0x7f, 0x01, 0x01, // T
        0x3f, 0x40, 0x40, 0x40, 0x3f, // U
        0x1f, 0x20, 0x40, 0x20, 0x1f, // V
        0x3f, 0x40, 0x38, 0x40, 0x3f, // W
        0x63, 0x14, 0x08, 0x14, 0x63, // X
        0x07, 0x08, 0x70, 0x08, 0x07, // Y
        0x61, 0x51, 0x49, 0x45, 0x43, // Z
    ]

    function drawChar(x: number, y: number, ch: number): void {
        let c = ch
        if (c < 32 || c > 90) {
            // 小寫轉大寫；其餘當空白
            if (c >= 97 && c <= 122) c = c - 32
            else c = 32
        }
        const base = (c - 32) * 5
        for (let col = 0; col < 5; col++) {
            let line = 0
            if (base + col < FONT.length) line = FONT[base + col]
            for (let row = 0; row < 7; row++) {
                drawPixel(x + col, y + row, (line & (1 << row)) != 0)
            }
        }
    }

    /**
     * 顯示一行英數字字串（左上角起，自動換行約 21 字／行）
     * @param text 只支援基本 ASCII／大寫為佳
     */
    //% block="OLED 顯示 %text"
    //% text.defl="Hello"
    //% weight=80
    export function showString(text: string): void {
        ensure()
        buf.fill(0)
        let x = 0
        let y = 0
        for (let i = 0; i < text.length; i++) {
            const ch = text.charCodeAt(i)
            if (ch == 10) {
                x = 0
                y += 8
                continue
            }
            if (x > WIDTH - 6) {
                x = 0
                y += 8
            }
            if (y > HEIGHT - 8) break
            drawChar(x, y, ch)
            x += 6
        }
        refresh()
    }

    /**
     * 畫實心矩形
     */
    //% block="OLED 畫矩形 x %x y %y 闊 %w 高 %h"
    //% x.defl=0 y.defl=0 w.defl=20 h.defl=10
    //% weight=40
    export function fillRect(x: number, y: number, w: number, h: number): void {
        ensure()
        for (let yy = y; yy < y + h; yy++) {
            for (let xx = x; xx < x + w; xx++) {
                drawPixel(xx, yy, true)
            }
        }
        refresh()
    }
}
