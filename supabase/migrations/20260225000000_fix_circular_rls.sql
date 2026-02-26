-- Fix circular RLS dependency between plans and plan_members
-- The plans SELECT policy queries plan_members, and plan_members SELECT policy
-- queries plans, causing infinite recursion and 500 errors.

-- Fix: simplify plan_members SELECT to only check the user's own membership rows.
DROP POLICY IF EXISTS "Users can view their memberships" ON public.plan_members;

CREATE POLICY "Users can view their memberships"
    ON public.plan_members FOR SELECT
    USING (user_id = auth.uid());
