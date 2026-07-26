CREATE INDEX IF NOT EXISTS "IX_TblLRPodcastEpisode_Category_EpisodeNo"
ON public."TblLRPodcastEpisode" ("Category", "EpisodeNo");

CREATE INDEX IF NOT EXISTS "IX_TblLRPodcastEpisode_Published_EpisodeNo"
ON public."TblLRPodcastEpisode" ("IsPublished", "EpisodeNo");
