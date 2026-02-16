/*
  # Email Notification Trigger for Gift Site Responses

  ## Purpose
  This migration creates a database trigger that fires when a new response is submitted.
  It will call a Supabase Edge Function to send an email notification to the site creator.

  ## How it works
  1. When a response is inserted into gift_site_responses
  2. The trigger fetches the site creator's email from profiles
  3. Calls the 'send-response-notification' edge function
  4. Edge function sends email to the creator

  ## Note
  The Edge Function needs to be deployed separately.
  For now, this trigger is commented out until the Edge Function is ready.
  You can also implement this using a simpler client-side approach.
*/

-- Function to notify site creator of new responses
CREATE OR REPLACE FUNCTION public.notify_response_submission()
RETURNS trigger AS $$
DECLARE
  creator_email text;
  site_slug text;
  recipient_name text;
BEGIN
  -- Get creator email and site details
  SELECT p.email, gs.slug, gs.content->>'recipient_name'
  INTO creator_email, site_slug, recipient_name
  FROM public.gift_sites gs
  JOIN public.profiles p ON gs.user_id = p.id
  WHERE gs.id = NEW.gift_site_id;

  -- If creator has an email, send notification
  -- Note: This requires setting up Supabase Edge Functions
  -- For now, we'll just log the event
  RAISE NOTICE 'New response: % for site % (creator: %)', NEW.response_type, site_slug, creator_email;

  -- TODO: Uncomment this when Edge Function is deployed
  /*
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/send-response-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
      ),
      body := jsonb_build_object(
        'creator_email', creator_email,
        'site_slug', site_slug,
        'recipient_name', recipient_name,
        'response_type', NEW.response_type,
        'message', NEW.message,
        'selected_date', NEW.selected_date
      )
    );
  */

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_response_submitted
  AFTER INSERT ON public.gift_site_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_response_submission();
