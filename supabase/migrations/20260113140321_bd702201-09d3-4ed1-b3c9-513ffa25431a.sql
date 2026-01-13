-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin privileges
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Allow anyone to read their own role
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (true);

-- Create contact_messages table for real-time messaging
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_name TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Users can read their own messages, admins can read all
CREATE POLICY "Users can read own messages or admin reads all"
ON public.contact_messages
FOR SELECT
USING (
    sender_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR public.has_role(current_setting('request.jwt.claims', true)::json->>'sub', 'admin')
);

-- Admins can update messages (mark as read, etc.)
CREATE POLICY "Admins can update messages"
ON public.contact_messages
FOR UPDATE
USING (public.has_role(current_setting('request.jwt.claims', true)::json->>'sub', 'admin'));

-- Enable realtime for contact_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;

-- Create trigger for updated_at
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();