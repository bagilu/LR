GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public."TblLRPodcastEpisode" TO anon, authenticated;

-- 管理資料建議使用 Supabase Dashboard，或日後另建登入管理端。
-- 本檔不授予 anon 新增、修改或刪除權限。
