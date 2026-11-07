CREATE TABLE public.trend_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  analysis_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  report jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.trend_reviews TO authenticated;
GRANT ALL ON public.trend_reviews TO service_role;

ALTER TABLE public.trend_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own trend reviews"
  ON public.trend_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own trend reviews"
  ON public.trend_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own trend reviews"
  ON public.trend_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
