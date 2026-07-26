-- 選用測試資料。正式匯入前可不執行本檔。
INSERT INTO public."TblLRPodcastEpisode"
("EpisodeNo", "Title", "ShortDescription", "Category", "SpotifyURL", "Transcript", "QuizURL", "IsPublished")
VALUES
(1, 'Podcast 範例集', '這是一筆用來檢查版面與資料庫連線的範例資料。', '未分類', NULL,
 '這裡可以貼上完整逐字稿。\n\n換行會在 podcast.html 中保留下來。', NULL, true)
ON CONFLICT ("EpisodeNo") DO NOTHING;
