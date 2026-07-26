# 林榮讀書館 LR Podcast Database Edition

本版本保留原網站的暖色紙張風格、導覽列、字體、卡片與頁尾，將 `knowledge.html` 改為資料庫化 Podcast 目錄，並新增 `podcast.html` 顯示單集完整逐字稿。

## 網頁

- `index.html`：首頁（原版保留）
- `product.html`：商品頁（原版保留）
- `knowledge.html`：Podcast 目錄，每頁 30 集，可切換四種排序
- `podcast.html?episode=集數`：單集資訊與逐字稿
- `aboutme.html`：關於我（原版保留）

因此新版共有 5 個 HTML 網頁。

## 部署順序

1. 在 Supabase SQL Editor 依序執行 `Database/01` 至 `06`。
2. `Database/07_SeedData.sql` 僅為選用測試資料。
3. 在 Supabase Project Settings → API 取得 Project URL 與 anon public key。
4. 編輯根目錄 `config.js`，填入上述兩項資料。
5. 將整個資料夾上傳至 GitHub Pages。

## 批次匯入

`Data/TblLRPodcastEpisode_ImportTemplate.csv` 是欄位範本。可先用試算表整理，再由 Supabase Table Editor 匯入 CSV。

注意：
- `EpisodeNo` 不可重複。
- `ShortDescription` 最多 50 個字元。
- CSV 中的逐字稿若含逗號、引號或換行，試算表匯出時會自動處理；不要手動破壞 CSV 引號格式。
- 目錄頁不下載 `Transcript`，只有開啟單集頁面時才讀取逐字稿。
- `config.js` 只能放 anon public key，不可放 service_role key。

## Edge Function

本版本不需要 Edge Function。
