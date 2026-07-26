CREATE OR REPLACE FUNCTION public."FnLRSetUpdatedAt"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW."UpdatedAt" = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "TrgLRPodcastEpisode_SetUpdatedAt"
ON public."TblLRPodcastEpisode";

CREATE TRIGGER "TrgLRPodcastEpisode_SetUpdatedAt"
BEFORE UPDATE ON public."TblLRPodcastEpisode"
FOR EACH ROW EXECUTE FUNCTION public."FnLRSetUpdatedAt"();
