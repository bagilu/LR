DROP POLICY IF EXISTS "LR public can read published podcast episodes"
ON public."TblLRPodcastEpisode";

CREATE POLICY "LR public can read published podcast episodes"
ON public."TblLRPodcastEpisode"
FOR SELECT
TO anon, authenticated
USING ("IsPublished" = true);
