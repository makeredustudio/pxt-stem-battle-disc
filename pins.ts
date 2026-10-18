/**
 * STEM 戰鬥盤 v1.0 腳位常數
 * 對照 Schematic / Sheet_1.net（STEM_4_BoardGame）
 */
//% color="#E67E22" icon="\uf2db" block="戰鬥盤-腳位"
namespace StemBattlePins {
    /** NeoPixel DATA（經 SN74LV1T34 → H1） */
    //% block="NeoPixel 腳 P14"
    export const NEOPIXEL = DigitalPin.P14

    /**
     * WT2003 UART：micro:bit TX = P16 → 模組 RX(pin6)
     * micro:bit RX = P15 ← 模組 TX(pin16)
     */
    //% block="音樂 TX 腳 P16"
    export const WT_TX = SerialPin.P16
    //% block="音樂 RX 腳 P15"
    export const WT_RX = SerialPin.P15

    /** OLED / 外接 NFC：標準 I2C */
    //% block="I2C SDA P20"
    export const I2C_SDA = DigitalPin.P20
    //% block="I2C SCL P19"
    export const I2C_SCL = DigitalPin.P19

    /** KEY1（同 micro:bit 按鈕 A） */
    //% block="按鍵1 腳 P5"
    export const KEY1 = DigitalPin.P5
    /** KEY2（同 micro:bit 按鈕 B） */
    //% block="按鍵2 腳 P11"
    export const KEY2 = DigitalPin.P11

    /** 擴充排針 */
    //% block="H8 腳 P0"
    export const H8_P0 = DigitalPin.P0
    //% block="H2 腳 P1"
    export const H2_P1 = DigitalPin.P1
    //% block="H2 腳 P2"
    export const H2_P2 = DigitalPin.P2
    //% block="H5 腳 P8"
    export const H5_P8 = DigitalPin.P8
    //% block="H6 腳 P13"
    export const H6_P13 = DigitalPin.P13
}
