/**
 * 編譯期／模擬粗測（唔會喺真機自動跑完整硬體）
 */
StemBattle.begin(8)
StemBattleLED.setBrightness(40)
StemBattleLED.showRainbow()
StemBattleMusic.setVolume(10)
// StemBattleMusic.playByIndex(1)  // 真機先開
StemBattleOLED.showString("TEST")
// StemBattleNFC.init()
basic.showIcon(IconNames.Yes)
