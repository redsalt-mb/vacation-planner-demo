-- ==========================================
-- Vacation Planner — Initial Schema
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- PROFILES (extends Supabase auth.users)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- DESTINATIONS
-- ==========================================
CREATE TABLE public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_local TEXT,
    country TEXT NOT NULL,
    region TEXT,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    default_zoom INTEGER DEFAULT 14,
    getting_there JSONB,
    useful_links JSONB,
    emergency_numbers JSONB,
    travel_tips TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Destinations are readable by all authenticated users
CREATE POLICY "Destinations are viewable by authenticated users"
    ON public.destinations FOR SELECT
    TO authenticated
    USING (true);

-- ==========================================
-- ACTIVITIES (per-destination)
-- ==========================================
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    external_place_id TEXT,
    name TEXT NOT NULL,
    name_local TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('food', 'outdoors', 'kids', 'culture')),
    subcategory TEXT,
    area TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    google_maps_url TEXT,
    kid_friendliness INTEGER CHECK (kid_friendliness BETWEEN 1 AND 5),
    tips TEXT[] DEFAULT '{}',
    best_season TEXT[] DEFAULT '{}',
    estimated_duration TEXT,
    price_range TEXT CHECK (price_range IN ('free', 'budget', 'moderate', 'expensive')),
    website TEXT,
    image_emoji TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    photo_attributions JSONB DEFAULT '[]',
    source TEXT DEFAULT 'ai',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activities_destination ON public.activities(destination_id);
CREATE INDEX idx_activities_category ON public.activities(destination_id, category);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities are viewable by authenticated users"
    ON public.activities FOR SELECT
    TO authenticated
    USING (true);

-- ==========================================
-- ITINERARY TEMPLATES (per-destination)
-- ==========================================
CREATE TABLE public.itinerary_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    activity_ids UUID[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.itinerary_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by authenticated users"
    ON public.itinerary_templates FOR SELECT
    TO authenticated
    USING (true);

-- ==========================================
-- DESTINATION WEATHER (seasonal tips)
-- ==========================================
CREATE TABLE public.destination_weather (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    season TEXT NOT NULL,
    months TEXT NOT NULL,
    temp_range TEXT NOT NULL,
    emoji TEXT NOT NULL,
    description TEXT NOT NULL,
    tips TEXT[] DEFAULT '{}',
    UNIQUE (destination_id, season)
);

ALTER TABLE public.destination_weather ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weather is viewable by authenticated users"
    ON public.destination_weather FOR SELECT
    TO authenticated
    USING (true);

-- ==========================================
-- PLANS (a user's vacation plan)
-- ==========================================
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id),
    name TEXT NOT NULL,
    travel_month TEXT,
    travel_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    share_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plans_owner ON public.plans(owner_id);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans"
    ON public.plans FOR SELECT
    USING (
        owner_id = auth.uid()
        OR id IN (SELECT plan_id FROM public.plan_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert own plans"
    ON public.plans FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own plans"
    ON public.plans FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete own plans"
    ON public.plans FOR DELETE
    USING (owner_id = auth.uid());

-- ==========================================
-- PLAN ACTIVITY STATUSES
-- ==========================================
CREATE TABLE public.plan_activity_statuses (
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'none' CHECK (status IN ('none', 'want', 'done')),
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (plan_id, activity_id)
);

ALTER TABLE public.plan_activity_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view statuses for their plans"
    ON public.plan_activity_statuses FOR SELECT
    USING (
        plan_id IN (
            SELECT id FROM public.plans WHERE owner_id = auth.uid()
            UNION
            SELECT plan_id FROM public.plan_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert statuses for their plans"
    ON public.plan_activity_statuses FOR INSERT
    WITH CHECK (
        plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can update statuses for their plans"
    ON public.plan_activity_statuses FOR UPDATE
    USING (
        plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can delete statuses for their plans"
    ON public.plan_activity_statuses FOR DELETE
    USING (
        plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid())
    );

-- ==========================================
-- PLAN ITINERARY DAYS
-- ==========================================
CREATE TABLE public.plan_itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    date DATE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plan_itinerary_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view days for their plans"
    ON public.plan_itinerary_days FOR SELECT
    USING (
        plan_id IN (
            SELECT id FROM public.plans WHERE owner_id = auth.uid()
            UNION
            SELECT plan_id FROM public.plan_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert days for their plans"
    ON public.plan_itinerary_days FOR INSERT
    WITH CHECK (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update days for their plans"
    ON public.plan_itinerary_days FOR UPDATE
    USING (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete days for their plans"
    ON public.plan_itinerary_days FOR DELETE
    USING (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

-- ==========================================
-- PLAN ITINERARY ITEMS
-- ==========================================
CREATE TABLE public.plan_itinerary_items (
    day_id UUID NOT NULL REFERENCES public.plan_itinerary_days(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (day_id, activity_id)
);

ALTER TABLE public.plan_itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items for their plans"
    ON public.plan_itinerary_items FOR SELECT
    USING (
        day_id IN (
            SELECT d.id FROM public.plan_itinerary_days d
            JOIN public.plans p ON d.plan_id = p.id
            WHERE p.owner_id = auth.uid()
            UNION
            SELECT d.id FROM public.plan_itinerary_days d
            JOIN public.plan_members pm ON d.plan_id = pm.plan_id
            WHERE pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert items for their plans"
    ON public.plan_itinerary_items FOR INSERT
    WITH CHECK (
        day_id IN (
            SELECT d.id FROM public.plan_itinerary_days d
            JOIN public.plans p ON d.plan_id = p.id
            WHERE p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items for their plans"
    ON public.plan_itinerary_items FOR UPDATE
    USING (
        day_id IN (
            SELECT d.id FROM public.plan_itinerary_days d
            JOIN public.plans p ON d.plan_id = p.id
            WHERE p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items for their plans"
    ON public.plan_itinerary_items FOR DELETE
    USING (
        day_id IN (
            SELECT d.id FROM public.plan_itinerary_days d
            JOIN public.plans p ON d.plan_id = p.id
            WHERE p.owner_id = auth.uid()
        )
    );

-- ==========================================
-- PLAN NOTES
-- ==========================================
CREATE TABLE public.plan_notes (
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    note TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (plan_id, activity_id)
);

ALTER TABLE public.plan_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes for their plans"
    ON public.plan_notes FOR SELECT
    USING (
        plan_id IN (
            SELECT id FROM public.plans WHERE owner_id = auth.uid()
            UNION
            SELECT plan_id FROM public.plan_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert notes for their plans"
    ON public.plan_notes FOR INSERT
    WITH CHECK (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update notes for their plans"
    ON public.plan_notes FOR UPDATE
    USING (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete notes for their plans"
    ON public.plan_notes FOR DELETE
    USING (plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

-- ==========================================
-- PHASE C: PLAN MEMBERS (sharing stubs)
-- ==========================================
CREATE TABLE public.plan_members (
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
    invited_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    PRIMARY KEY (plan_id, user_id)
);

ALTER TABLE public.plan_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their memberships"
    ON public.plan_members FOR SELECT
    USING (user_id = auth.uid() OR plan_id IN (SELECT id FROM public.plans WHERE owner_id = auth.uid()));

-- ==========================================
-- PHASE C: PLAN MESSAGES (chat stubs)
-- ==========================================
CREATE TABLE public.plan_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    is_ai BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_plan ON public.plan_messages(plan_id, created_at);

ALTER TABLE public.plan_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their plans"
    ON public.plan_messages FOR SELECT
    USING (
        plan_id IN (
            SELECT id FROM public.plans WHERE owner_id = auth.uid()
            UNION
            SELECT plan_id FROM public.plan_members WHERE user_id = auth.uid()
        )
    );
