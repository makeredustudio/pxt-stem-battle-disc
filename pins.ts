/**
 * STEM 戰鬥盤 v1.0 腳位常數
 * 對照 Schematic / Sheet_1.net（STEM_4_BoardGame）
 * （唔出 toolbox；畀其他 namespace 用）
 */
namespace StemBattlePins {
    /** NeoPixel DATA（經 SN74LV1T34 → H1） */
    export const NEOPIXEL = DigitalPin.P14

    /**
     * WT2003 UART：micro:bit TX = P16 → 模組 RX(pin6)
     * micro:bit RX = P15 ← 模組 TX(pin16)
     */
    export const WT_TX = SerialPin.P16
    export const WT_RX = SerialPin.P15

    /** OLED / 外接 NFC：標準 I2C */
    export const I2C_SDA = DigitalPin.P20
    export const I2C_SCL = DigitalPin.P19

    /** KEY1（同 micro:bit 按鈕 A） */
    export const KEY1 = DigitalPin.P5
    /** KEY2（同 micro:bit 按鈕 B） */
    export const KEY2 = DigitalPin.P11

    /** 擴充排針 */
    export const H8_P0 = DigitalPin.P0
    export const H2_P1 = DigitalPin.P1
    export const H2_P2 = DigitalPin.P2
    export const H5_P8 = DigitalPin.P8
    export const H6_P13 = DigitalPin.P13
}
