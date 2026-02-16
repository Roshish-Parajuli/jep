

export type GiftTemplateType = 'valentine_classic' | 'valentine_ask' | 'birthday' | 'anniversary' | 'custom';
export type CardTemplateType = 'story_simple' | 'story_animated' | 'story_photo';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
}

// Base content interface, specific templates will extend this or use specific shapes
export interface GiftSiteContent {
    recipient_name?: string;
    hero_headline?: string;
    hero_subtext?: string;
    // Valentine specific
    secret_message?: string;
    secret_code?: string;
    love_letter?: string;
    promises?: string[];
    timeline?: any[];
    music_url?: string;
    final_message?: string;
    // Birthday specific
    age?: number;
    wishes?: string[];
    // Ask specific
    ask_question?: string; // "Will you be my Valentine?"
    yes_response?: string;
    no_response?: string;
}

export interface GiftSite {
    id: string;
    user_id: string;
    slug: string;
    template_type: GiftTemplateType;
    content: GiftSiteContent;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface GiftCardContent {
    sender_name?: string;
    recipient_name?: string;
    message?: string;
    photo_url?: string;
    theme_color?: string; // e.g. 'pastel-pink', 'mint-green'
}

export interface GiftCard {
    id: string;
    user_id: string;
    template_id: CardTemplateType;
    content: GiftCardContent;
    created_at: string;
}

export interface GiftSiteResponse {
    id: string;
    gift_site_id: string;
    response_type: 'yes' | 'no' | 'maybe';
    message?: string;
    selected_date?: string;
    responded_at: string;
}
