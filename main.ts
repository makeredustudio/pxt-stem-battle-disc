/**
 * STEM 戰鬥盤 MakeCode 擴充 · 入口
 * 各功能見：StemBattleLED / Music / OLED / NFC / Buttons / Pins
 *
 * 目標：micro:bit V2（建議）。V1 無咪高峰；其餘腳位相同。
 */
//% color="#2C3E50" icon="\uf135" block="戰鬥盤"
namespace StemBattle {
    /**
     * 一次初始化常用週邊（LED 數量、音樂、OLED）
     * NFC 外接模組請另行呼叫「初始化外接 NFC」
     * @param leds NeoPixel 數量，預設 64
     */
    //% block="一鍵初始化（LED數量 %leds ）"
    //% leds.defl=64 leds.min=1 leds.max=256
    //% weight=100
    export function begin(leds: number = 64): void {
        StemBattleLED.init(leds)
        StemBattleMusic.init()
        StemBattleOLED.init()
    }
}
