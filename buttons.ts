/**
 * 戰鬥盤按鍵 KEY1 / KEY2
 * 原理圖：KEY1→P5、KEY2→P11（同 micro:bit 內建 A／B；按下接地）
 */
//% color="#F39C12" icon="\uf111" block="戰鬥盤-按鍵"
namespace StemBattleButtons {
    let pullReady = false

    function ensurePull(): void {
        if (pullReady) return
        pins.setPull(StemBattlePins.KEY1, PinPullMode.PullUp)
        pins.setPull(StemBattlePins.KEY2, PinPullMode.PullUp)
        pullReady = true
    }

    /**
     * KEY1 有冇按下（P5／按鈕 A）
     */
    //% block="KEY1 按下？"
    //% weight=100
    export function key1Pressed(): boolean {
        ensurePull()
        return pins.digitalReadPin(StemBattlePins.KEY1) == 0 ||
            input.buttonIsPressed(Button.A)
    }

    /**
     * KEY2 有冇按下（P11／按鈕 B）
     */
    //% block="KEY2 按下？"
    //% weight=90
    export function key2Pressed(): boolean {
        ensurePull()
        return pins.digitalReadPin(StemBattlePins.KEY2) == 0 ||
            input.buttonIsPressed(Button.B)
    }

    /**
     * 當 KEY1 按下時執行（等同 onButtonPressed A）
     */
    //% block="當 KEY1 按下時"
    //% weight=80
    export function onKey1(handler: () => void): void {
        input.onButtonPressed(Button.A, handler)
    }

    /**
     * 當 KEY2 按下時執行（等同 onButtonPressed B）
     */
    //% block="當 KEY2 按下時"
    //% weight=70
    export function onKey2(handler: () => void): void {
        input.onButtonPressed(Button.B, handler)
    }
}
