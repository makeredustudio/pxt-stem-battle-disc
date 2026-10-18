# 點樣載入呢個擴充到 MakeCode

## 方法 A：GitHub（推薦，之後公開 repo 用）

1. 打開 [MakeCode micro:bit](https://makecode.microbit.org/)
2. 新專案 → 左邊 **進階** → **擴充**
3. 喺搜尋框貼上 GitHub URL（例如 `https://github.com/<org>/pxt-stem-battle-disc`）
4. 撳搜尋結果加入

## 方法 B：本地 ZIP（而家即可）

1. 用本資料夾壓縮包：`pxt-stem-battle-disc.zip`  
   （解壓後根目錄要有 `pxt.json`）
2. MakeCode → **進階** → **擴充** → 最底 **匯入…** / `Import file`  
   或者：專案設定 → 匯入檔案 → 選 zip  
3. 若介面只接受 GitHub：可先把本資料夾 push 去你自己 GitHub，再用方法 A。

### 用 `pxt` CLI 本地測試（選用）

```bash
npm install -g pxt
cd pxt-stem-battle-disc
pxt target microbit
pxt install
pxt serve
```

## 匯入後會自動拉依賴

- `microsoft/pxt-neopixel`（NeoPixel）

OLED／WT2003／NFC 驅動已內建喺本擴充，唔使再裝第二個 OLED 擴充（除非你想用其他積木）。
