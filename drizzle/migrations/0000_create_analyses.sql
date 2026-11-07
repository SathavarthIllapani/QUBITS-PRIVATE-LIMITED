CREATE TABLE public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  file_name text NOT NULL,
  mime_type text,
  storage_path text NOT NULL,
  summary text,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  calculator_id text,
  values jsonb,
  outputs jsonb,
  verdicts jsonb,
  status text NOT NULL DEFAULT 'analyzed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own analyses"
  ON public.analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own analyses"
  ON public.analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own analyses"
  ON public.analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own analyses"
  ON public.analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage: per-user folders inside the private analysis-documents bucket
CREATE POLICY "Users upload to own analysis folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'analysis-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users read own analysis files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'analysis-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own analysis files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'analysis-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );