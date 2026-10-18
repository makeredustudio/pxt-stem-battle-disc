/**
 * 戰鬥盤 NeoPixel（WS2812）· DATA = P14
 */
//% color="#9B59B6" icon="\uf0eb" block="戰鬥盤-LED"
namespace StemBattleLED {
    let strip: neopixel.Strip = null
    let ledCount = 64

    /**
     * 初始化燈帶（預設 64；戰鬥盤亦可 128）
     * @param n LED 數量，例如 64 或 128
     */
    //% block="初始化 NeoPixel 數量 %n"
    //% n.defl=64 n.min=1 n.max=256
    //% weight=100
    export function init(n: number = 64): void {
        ledCount = Math.max(1, n)
        strip = neopixel.create(StemBattlePins.NEOPIXEL, ledCount, NeoPixelMode.RGB)
        strip.setBrightness(80)
        strip.clear()
        strip.show()
    }

    function ensure(): neopixel.Strip {
        if (!strip) init(64)
        return strip
    }

    /**
     * 取得底層燈帶物件（進階）
     */
    //% block="NeoPixel 燈帶"
    //% weight=10
    export function stripObj(): neopixel.Strip {
        return ensure()
    }

    /**
     * 設定亮度 0–255
     */
    //% block="設定亮度 %bri"
    //% bri.defl=80 bri.min=0 bri.max=255
    //% weight=90
    export function setBrightness(bri: number): void {
        ensure().setBrightness(bri)
    }

    /**
     * 全條顯示彩虹
     */
    //% block="顯示彩虹"
    //% weight=80
    export function showRainbow(): void {
        const s = ensure()
        s.showRainbow(1, 360)
        s.show()
    }

    /**
     * 清除全部 LED
     */
    //% block="熄滅全部 LED"
    //% weight=70
    export function clear(): void {
        const s = ensure()
        s.clear()
        s.show()
    }

    /**
     * 設定某一顆顏色（RGB）
     */
    //% block="設定第 %i 顆 RGB 紅 %r 綠 %g 藍 %b"
    //% i.defl=0 r.defl=255 g.defl=0 b.defl=0
    //% weight=60
    export function setPixelRGB(i: number, r: number, g: number, b: number): void {
        const s = ensure()
        s.setPixelColor(i, neopixel.rgb(r, g, b))
    }

    /**
     * 送出畫面
     */
    //% block="更新 LED 顯示"
    //% weight=50
    export function show(): void {
        ensure().show()
    }

    /**
     * 旋轉彩虹動畫一步
     */
    //% block="彩虹旋轉一步"
    //% weight=40
    export function rotateRainbowStep(): void {
        const s = ensure()
        s.rotate(1)
        s.show()
    }
}
