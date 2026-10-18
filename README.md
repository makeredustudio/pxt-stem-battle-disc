# STEM 戰鬥盤 MakeCode 擴充（v1.0）

學造工作室 · micro:bit 適配板 **STEM_4_BoardGame / 爆旋陀螺聲光戰鬥盤** 專用擴充。

支援：**NeoPixel 燈帶**、**WT2003H4-16S（TF/SD 音樂）**、**SSD1306 OLED**、**外接 PN532 NFC**、板上 **KEY1／KEY2**。

> English pin table at the bottom.

---

## 腳位一覽（硬體 v1）

| 功能 | micro:bit | 板上 |
|------|-----------|------|
| NeoPixel DATA | **P14** | 經 SN74LV1T34 → H1（1=+5V, 2=DATA, 3=GND） |
| WT2003 UART TX（主機→模組） | **P16** | → U4.6 PA0/RX |
| WT2003 UART RX（模組→主機） | **P15** | ← U4.16 TX |
| OLED / NFC I2C SDA | **P20** | H7.3 |
| OLED / NFC I2C SCL | **P19** | H7.4 |
| KEY1 | **P5** | 同按鈕 A |
| KEY2 | **P11** | 同按鈕 B |
| 擴充 | P0 / P1 / P2 / P8 / P13 | H8 / H2 / H5 / H6 |

**重要：**
- TF 卡接喺 WT2003，**唔使** micro:bit bit-bang SD。
- 板上 U2 係 **I2C EEPROM**，**唔係 NFC**。NFC 請外接 PN532 去 H7。
- UART 方向以原理圖為準：`P16=TX`、`P15=RX`（同部分舊文件寫反嘅講法唔同）。

---

## 工具箱分類

| 分類 | 內容 |
|------|------|
| 戰鬥盤-LED | 初始化、彩虹、亮度、熄滅 |
| 戰鬥盤-音樂 | 初始化、播第 N 首、音量、停／下一首 |
| 戰鬥盤-OLED | 初始化、清屏、顯示字串 |
| 戰鬥盤-NFC | 初始化外接模組、讀 UID |
| 戰鬥盤-按鍵 | KEY1／KEY2 |
| 戰鬥盤 | 一鍵初始化 |

---

## 快速開始

1. 用 MakeCode 載入本擴充（見 `PACKAGE.md`）
2. 積木示例：

```
一鍵初始化（LED數量 64）
顯示彩虹
播放第 1 首
OLED 顯示 "Hello"
```

更完整手把手步驟見 `docs/samples.md`。

---

## WT2003 協議摘要

- 鮑率 **9600**，8N1，3.3V TTL  
- 幀：`7E | LEN | CMD | PARAM… | CHECKSUM | EF`  
- TF 根目錄索引播放：**A2**（例：播第 1 首 → `7E 05 A2 00 01 A8 EF`）  
- 音量 **AE**（0–31）  
- 停止 **AB**、下一首 **AC**、上一首 **AD**  

SD 卡檔案索引順序＝**拷入 TF 嘅時間順序**。

---

## V1 / V2

- **建議 micro:bit V2**（同現有聲控 DEMO 相容）。  
- V1 腳位相同，但無咪高峰；LED／音樂／OLED／NFC 積木仍可用。

---

## Pin table (EN)

| Function | Pin | Notes |
|----------|-----|-------|
| NeoPixel | P14 | WS2812 via level shifter |
| WT2003 TX (from micro:bit) | P16 | to module RX |
| WT2003 RX (to micro:bit) | P15 | from module TX |
| I2C SDA / SCL | P20 / P19 | OLED + optional PN532 on H7 |
| KEY1 / KEY2 | P5 / P11 | same as buttons A / B |

License: MIT · 學造工作室
