# 手把手 Sample（4 個）

每個 sample 都假設已加入 **stem-battle-disc** 擴充。  
積木喺左邊對應分類；下面用 JavaScript 方便「Vibe coding」對照。

---

## (A) NeoPixel 彩虹（預設 64；可改 128）

**步驟**
1. 燈帶 DATA → 戰鬥盤 **H1**（注意 5V／GND）
2. 積木：`初始化 NeoPixel 數量 64` → `顯示彩虹`
3. 若係 128 燈：數量改 **128**

```javascript
StemBattleLED.init(64)
StemBattleLED.showRainbow()
basic.forever(function () {
    StemBattleLED.rotateRainbowStep()
    basic.pause(50)
})
```

---

## (B) 播 SD 第 1 首（WT2003）

**步驟**
1. TF 卡放入板上卡槽；根目錄放 `0001.mp3` 等（或任意 mp3，按拷入順序為索引 1,2,3…）
2. 喇叭已接板上 SPK
3. 積木：`初始化 SD 音樂模組` → `設定音量 20` → `播放第 1 首`

```javascript
StemBattleMusic.init()
StemBattleMusic.setVolume(20)
StemBattleMusic.playByIndex(1)
```

UART：**P16=TX → 模組 RX**，**P15=RX ← 模組 TX**，9600。

---

## (C) OLED 顯示 Hello

**步驟**
1. SSD1306 128×64 I2C 接到 **H7**（GND／VCC／SDA／SCL）
2. 積木：`初始化 OLED` → `OLED 顯示 "Hello"`

```javascript
StemBattleOLED.init()
StemBattleOLED.showString("Hello")
```

地址預設 `0x3C`。只支援基本 ASCII（小寫會轉大寫）。

---

## (D) 讀 NFC UID（外接 PN532）

**注意：v1 板無內建 NFC。** 請用 PN532 I2C 模組插 H7。

```javascript
StemBattleNFC.init()
basic.forever(function () {
    let id = StemBattleNFC.readUID()
    if (id.length > 0) {
        basic.showString(id)
        StemBattleOLED.showString(id)
    }
    basic.pause(500)
})
```

無卡／無模組時 `readUID()` 回傳空字串。

---

## 一鍵初始化

```javascript
StemBattle.begin(64)  // LED + 音樂 UART + OLED
StemBattleLED.showRainbow()
StemBattleMusic.playByIndex(1)
StemBattleOLED.showString("READY")
```
