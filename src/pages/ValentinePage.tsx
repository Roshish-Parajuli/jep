import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ValentinePage as ValentinePageType, ValentinePhoto } from '../types/valentine';
import { GiftSite } from '../types/gift';
import { HeroSection } from '../components/ValentinePage/HeroSection';
import { GallerySection } from '../components/ValentinePage/GallerySection';
import { SecretMessageSection } from '../components/ValentinePage/SecretMessageSection';
import { TimelineSection } from '../components/ValentinePage/TimelineSection';
import { LoveLetterSection } from '../components/ValentinePage/LoveLetterSection';
import { MusicSection } from '../components/ValentinePage/MusicSection';
import { PromiseSection } from '../components/ValentinePage/PromiseSection';
import { FinalSurpriseSection } from '../components/ValentinePage/FinalSurpriseSection';
import { ValentineAskTemplate } from '../components/GiftTemplates/ValentineAskTemplate';
import { useParams } from 'react-router-dom';

interface ValentinePageProps {
  slug?: string;
}

export default function ValentinePage({ slug: slugFromProp }: ValentinePageProps) {
  const params = useParams<{ slug: string }>();
  const slug = slugFromProp || params.slug;

  // State for Legacy Pages
  const [legacyData, setLegacyData] = useState<ValentinePageType | null>(null);
  const [photos, setPhotos] = useState<ValentinePhoto[]>([]);

  // State for New Gift Sites
  const [giftSite, setGiftSite] = useState<GiftSite | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setError('No Digital Gift page slug provided.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Try fetching from new 'gift_sites' table first
        const { data: giftData, error: giftError } = await supabase
          .from('gift_sites')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (giftData) {
          setGiftSite(giftData);
          setLoading(false);
          return;
        }

        // 2. If not found, try fetching from legacy 'valentine_pages' table
        const { data: pageData, error: pageError } = await supabase
          .from('valentine_pages')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (pageError && !giftError) throw pageError;

        if (!pageData) {
          setError('This Digital Gift page does not exist. Please check the URL.');
          setLoading(false);
          return;
        }

        setLegacyData(pageData);

        // Fetch photos for legacy pages
        const { data: photosData, error: photosError } = await supabase
          .from('valentine_photos')
          .select('*')
          .eq('valentine_id', pageData.id)
          .order('display_order', { ascending: true });

        if (photosError) throw photosError;

        setPhotos(photosData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Gift page:', err);
        setError('Failed to load this Digital Gift page. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-rose-400 text-lg">Loading your Digital Gift...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-rose-600 mb-4">Oops!</h1>
          <p className="text-rose-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  // --- RENDERER FOR NEW GIFT SITES ---
  if (giftSite) {
    if (giftSite.template_type === 'valentine_ask') {
      return <ValentineAskTemplate content={giftSite.content} giftSiteId={giftSite.id} />;
    }

    if (giftSite.template_type === 'valentine_classic') {
      // Map new content to legacy format for reuse
      const content = giftSite.content;
      return (
        <div className="relative">
          <HeroSection
            recipientName={content.recipient_name || 'Valentine'}
            headline={content.hero_headline || 'Happy Valentine Day!'}
            subtext={content.hero_subtext || ''}
            onStart={handleStart}
          />
          {started && (
            <div ref={galleryRef}>
              {/* Note: Photos not yet supported in new schema, skipping gallery or passing empty */}
              <GallerySection photos={[]} />
              <SecretMessageSection
                message={content.secret_message || ''}
                secretCode={content.secret_code || null}
              />
              <TimelineSection timeline={content.timeline || []} />
              <LoveLetterSection letter={content.love_letter || ''} />
              <PromiseSection promises={content.promises || []} />
              <FinalSurpriseSection message={content.final_message || ''} />
            </div>
          )}
          <MusicSection musicUrl={content.music_url || null} autoPlay={started} />
        </div>
      );
    }

    // Fallback for unknown templates
    return <div>Unknown template type: {giftSite.template_type}</div>;
  }

  // --- RENDERER FOR LEGACY PAGES ---
  if (legacyData) {
    return (
      <div className="relative">
        <meta name="robots" content="noindex, nofollow" />

        <HeroSection
          recipientName={legacyData.recipient_name}
          headline={legacyData.hero_headline}
          subtext={legacyData.hero_subtext}
          onStart={handleStart}
        />

        {started && (
          <div ref={galleryRef}>
            <GallerySection photos={photos} />
            <SecretMessageSection
              message={legacyData.secret_message}
              secretCode={legacyData.secret_code}
            />
            <TimelineSection timeline={legacyData.timeline} />
            <LoveLetterSection letter={legacyData.love_letter} />
            <PromiseSection promises={legacyData.promises} />
            <FinalSurpriseSection message={legacyData.final_message} />
          </div>
        )}

        <MusicSection musicUrl={legacyData.music_url} autoPlay={started} />
      </div>
    );
  }

  return null;
}
