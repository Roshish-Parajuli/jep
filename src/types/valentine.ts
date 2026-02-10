export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

export interface ValentinePage {
  id: string;
  slug: string;
  recipient_name: string;
  hero_headline: string;
  hero_subtext: string;
  secret_message: string;
  secret_code: string | null;
  love_letter: string;
  promises: string[];
  timeline: TimelineEvent[];
  music_url: string | null;
  final_message: string;
  created_at: string;
}

export interface ValentinePhoto {
  id: string;
  valentine_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}
