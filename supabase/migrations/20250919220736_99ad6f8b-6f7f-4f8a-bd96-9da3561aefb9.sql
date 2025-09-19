-- Enable real-time updates for the sites table
ALTER TABLE public.sites REPLICA IDENTITY FULL;

-- Add the sites table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sites;