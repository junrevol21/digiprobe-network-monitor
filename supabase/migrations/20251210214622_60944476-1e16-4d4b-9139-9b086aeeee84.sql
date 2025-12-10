-- Create test_sessions table
CREATE TABLE public.test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  isp_name TEXT,
  public_ip TEXT,
  operator_label TEXT NOT NULL,
  test_mode TEXT NOT NULL CHECK (test_mode IN ('static', 'drive')),
  activity TEXT,
  remark TEXT,
  poi_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_results table
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  ping DOUBLE PRECISION,
  download_speed DOUBLE PRECISION,
  upload_speed DOUBLE PRECISION,
  browsing_time DOUBLE PRECISION,
  video_mos DOUBLE PRECISION,
  category_color TEXT CHECK (category_color IN ('blue', 'green', 'yellow', 'red')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for test_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.test_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.test_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.test_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.test_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for test_results (via session ownership)
CREATE POLICY "Users can view results from their sessions"
  ON public.test_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.test_sessions
      WHERE test_sessions.id = test_results.session_id
      AND test_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create results for their sessions"
  ON public.test_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_sessions
      WHERE test_sessions.id = test_results.session_id
      AND test_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete results from their sessions"
  ON public.test_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.test_sessions
      WHERE test_sessions.id = test_results.session_id
      AND test_sessions.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for test_sessions
CREATE TRIGGER update_test_sessions_updated_at
  BEFORE UPDATE ON public.test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_test_sessions_user_id ON public.test_sessions(user_id);
CREATE INDEX idx_test_sessions_created_at ON public.test_sessions(created_at DESC);
CREATE INDEX idx_test_results_session_id ON public.test_results(session_id);
CREATE INDEX idx_test_results_created_at ON public.test_results(created_at DESC);