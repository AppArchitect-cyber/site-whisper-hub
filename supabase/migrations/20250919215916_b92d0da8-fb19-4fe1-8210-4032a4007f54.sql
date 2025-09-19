-- Create sites table to store site configurations
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  site_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Create change logs table to track all modifications
CREATE TABLE public.site_change_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL,
  change_type TEXT NOT NULL, -- 'whatsapp_update', 'domain_update', 'status_change', etc.
  old_value TEXT,
  new_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on change logs
ALTER TABLE public.site_change_logs ENABLE ROW LEVEL SECURITY;

-- Create admin profiles table
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin-only access
CREATE POLICY "Admins can view all sites" 
ON public.sites 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admins can update sites" 
ON public.sites 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admins can insert sites" 
ON public.sites 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- RLS policies for change logs
CREATE POLICY "Admins can view all change logs" 
ON public.site_change_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admins can create change logs" 
ON public.site_change_logs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- RLS policies for admin profiles
CREATE POLICY "Admins can view admin profiles" 
ON public.admin_profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can update their own profile" 
ON public.admin_profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 10 sample sites
INSERT INTO public.sites (domain, whatsapp_number, site_name) VALUES
  ('site1.example.com', '+1234567890', 'Site One'),
  ('site2.example.com', '+1234567891', 'Site Two'), 
  ('site3.example.com', '+1234567892', 'Site Three'),
  ('site4.example.com', '+1234567893', 'Site Four'),
  ('site5.example.com', '+1234567894', 'Site Five'),
  ('site6.example.com', '+1234567895', 'Site Six'),
  ('site7.example.com', '+1234567896', 'Site Seven'),
  ('site8.example.com', '+1234567897', 'Site Eight'),
  ('site9.example.com', '+1234567898', 'Site Nine'),
  ('site10.example.com', '+1234567899', 'Site Ten');