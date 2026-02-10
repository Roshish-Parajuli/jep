import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ValentinePage as ValentinePageType, ValentinePhoto } from '../types/valentine';
import { HeroSection } from '../components/ValentinePage/HeroSection';
import { GallerySection } from '../components/ValentinePage/GallerySection';
import { SecretMessageSection } from '../components/ValentinePage/SecretMessageSection';
import { TimelineSection } from '../components/ValentinePage/TimelineSection';
import { LoveLetterSection } from '../components/ValentinePage/LoveLetterSection';
import { MusicSection } from '../components/ValentinePage/MusicSection';
import { PromiseSection } from '../components/ValentinePage/PromiseSection';
import { FinalSurpriseSection } from '../components/ValentinePage/FinalSurpriseSection';
import { useParams } from 'react-router-dom';

interface ValentinePageProps {
  slug?: string;
}

export default function ValentinePage({ slug: slugFromProp }: ValentinePageProps) {
  const params = useParams<{ slug: string }>();
  const slug = slugFromProp || params.slug;
  const [pageData, setPageData] = useState<ValentinePageType | null>(null);
  const [photos, setPhotos] = useState<ValentinePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setError('No Valentine page slug provided.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data: pageData, error: pageError } = await supabase
          .from('valentine_pages')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (pageError) throw pageError;

        if (!pageData) {
          setError('This Valentine page does not exist. Please check the URL.');
          setLoading(false);
          return;
        }

        setPageData(pageData);

        const { data: photosData, error: photosError } = await supabase
          .from('valentine_photos')
          .select('*')
          .eq('valentine_id', pageData.id)
          .order('display_order', { ascending: true });

        if (photosError) throw photosError;

        setPhotos(photosData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Valentine page:', err);
        setError('Failed to load this Valentine page. Please try again.');
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
          <p className="text-rose-400 text-lg">Loading your Valentine...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-rose-600 mb-4">Oops!</h1>
          <p className="text-rose-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <meta name="robots" content="noindex, nofollow" />

      <HeroSection
        recipientName={pageData.recipient_name}
        headline={pageData.hero_headline}
        subtext={pageData.hero_subtext}
        onStart={handleStart}
      />

      {started && (
        <div ref={galleryRef}>
          <GallerySection photos={photos} />
          <SecretMessageSection
            message={pageData.secret_message}
            secretCode={pageData.secret_code}
          />
          <TimelineSection timeline={pageData.timeline} />
          <LoveLetterSection letter={pageData.love_letter} />
          <PromiseSection promises={pageData.promises} />
          <FinalSurpriseSection message={pageData.final_message} />
        </div>
      )}

      <MusicSection musicUrl={pageData.music_url} />
    </div>
  );
}
