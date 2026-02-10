import { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TimelineEvent, ValentinePage } from '../types/valentine';
import React from 'react';

interface PhotoInput {
  url: string;
  caption: string;
}

interface ValentineFormPageProps {
  pageData?: ValentinePage | null;
  onBack: () => void;
}

const ValentineFormPage: React.FC<ValentineFormPageProps> = ({ pageData, onBack }) => {
  const [recipientName, setRecipientName] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('For You, Always');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [loveLetter, setLoveLetter] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [promises, setPromises] = useState<string[]>(['']);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { title: '', date: '', description: '' },
  ]);
  const [photos, setPhotos] = useState<PhotoInput[]>([{ url: '', caption: '' }]);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null); // Supabase session

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    if (pageData) {
      setRecipientName(pageData.recipient_name);
      setHeroHeadline(pageData.hero_headline);
      setHeroSubtext(pageData.hero_subtext || '');
      setSecretMessage(pageData.secret_message);
      setSecretCode(pageData.secret_code || '');
      setLoveLetter(pageData.love_letter);
      setFinalMessage(pageData.final_message);
      setMusicUrl(pageData.music_url || '');
      setPromises(pageData.promises.length > 0 ? pageData.promises : ['']);
      setTimeline(pageData.timeline.length > 0 ? pageData.timeline : [{ title: '', date: '', description: '' }]);
      // Fetch and set photos for editing
      const fetchPhotos = async () => {
        const { data } = await supabase.from('valentine_photos').select('*').eq('valentine_id', pageData.id);
        setPhotos(data && data.length > 0 ? data.map(p => ({ url: p.photo_url, caption: p.caption || '' })) : [{ url: '', caption: '' }]);
      }
      fetchPhotos();
    }
  }, [pageData]);

  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  };

  const addPromise = () => setPromises([...promises, '']);
  const removePromise = (index: number) => setPromises(promises.filter((_, i) => i !== index));
  const updatePromise = (index: number, value: string) => {
    const newPromises = [...promises];
    newPromises[index] = value;
    setPromises(newPromises);
  };

  const addTimelineEvent = () =>
    setTimeline([...timeline, { title: '', date: '', description: '' }]);
  const removeTimelineEvent = (index: number) =>
    setTimeline(timeline.filter((_, i) => i !== index));
  const updateTimelineEvent = (
    index: number,
    field: keyof TimelineEvent,
    value: string
  ) => {
    const newTimeline = [...timeline];
    newTimeline[index][field] = value;
    setTimeline(newTimeline);
  };

  const addPhoto = () => setPhotos([...photos, { url: '', caption: '' }]);
  const removePhoto = (index: number) => setPhotos(photos.filter((_, i) => i !== index));
  const updatePhoto = (index: number, field: 'url' | 'caption', value: string) => {
    const newPhotos = [...photos];
    newPhotos[index][field] = value;
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const slug = pageData?.slug || generateRandomSlug();
      const filteredPromises = promises.filter((p) => p.trim() !== '');
      const filteredTimeline = timeline.filter(
        (t) => t.title.trim() !== '' || t.date.trim() !== '' || t.description.trim() !== ''
      );
      const filteredPhotos = photos.filter((p) => p.url.trim() !== '');

      const pageContent = {
        slug,
        recipient_name: recipientName,
        hero_headline: heroHeadline,
        hero_subtext: heroSubtext,
        secret_message: secretMessage,
        secret_code: secretCode || null,
        love_letter: loveLetter,
        promises: filteredPromises,
        timeline: filteredTimeline,
        music_url: musicUrl || null,
        final_message: finalMessage,
        user_id: session?.user?.id, // Link to the authenticated user
      };

      let newPageData;

      if (pageData) {
        const { data, error } = await supabase
          .from('valentine_pages')
          .update(pageContent)
          .eq('id', pageData.id)
          .select()
          .single();
        if (error) throw error;
        newPageData = data;
        await supabase.from('valentine_photos').delete().eq('valentine_id', pageData.id);

      } else {
        const { data, error } = await supabase
          .from('valentine_pages')
          .insert(pageContent)
          .select()
          .single();
        if (error) throw error;
        newPageData = data;
      }

      if (filteredPhotos.length > 0 && newPageData) {
        const photoInserts = filteredPhotos.map((photo, index) => ({
          valentine_id: newPageData.id,
          photo_url: photo.url,
          caption: photo.caption || null,
          display_order: index,
        }));

        const { error: photosError } = await supabase
          .from('valentine_photos')
          .insert(photoInserts);

        if (photosError) {
          console.error('Photos insert error:', photosError);
          throw new Error(photosError.message || 'Failed to add photos');
        }
      }

      const url = `${window.location.origin}/valentine/${slug}`;
      setGeneratedUrl(url);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error saving Valentine page:', errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setRecipientName('');
    setHeroHeadline('For You, Always');
    setHeroSubtext('');
    setSecretMessage('');
    setSecretCode('');
    setLoveLetter('');
    setFinalMessage('');
    setMusicUrl('');
    setPromises(['']);
    setTimeline([{ title: '', date: '', description: '' }]);
    setPhotos([{ url: '', caption: '' }]);
    setGeneratedUrl(null);
    setErrorMessage(null);
    onBack();
  };

  if (generatedUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="w-20 h-20 text-rose-500 mx-auto mb-6 animate-pulse" fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4">
            {pageData ? 'Page Updated Successfully!' : 'Your Valentine Page is Ready!'}
          </h1>
          <p className="text-lg text-rose-400 mb-8">
            Share this special link with your loved one
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <p className="text-gray-600 mb-4 font-semibold">Your unique Valentine URL:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-x-4">
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Preview Page
            </a>
            <button
              onClick={resetForm}
              className="inline-block px-8 py-3 bg-white text-rose-600 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <div className="text-center flex-1">
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">
              {pageData ? 'Edit Valentine Page' : 'Create a Valentine Page'}
            </h1>
            <p className="text-lg text-rose-400">
              {pageData ? 'Update the details below' : 'Build a personalized digital love letter'}
            </p>
          </div>
          <div className="w-[120px]" /> {/* Spacer to balance the header */}
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-semibold mb-1">Error</p>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Their name..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="For You, Always"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Hero Subtext (Optional)
                </label>
                <input
                  type="text"
                  value={heroSubtext}
                  onChange={(e) => setHeroSubtext(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="A tagline or subtitle..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Photos</h2>
            {photos.map((photo, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Photo {index + 1}</span>
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={photo.url}
                  onChange={(e) => updatePhoto(index, 'url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Photo URL..."
                />
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updatePhoto(index, 'caption', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Caption (optional)..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addPhoto}
              className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-semibold"
            >
              <Plus size={20} />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Secret Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Secret Message *
                </label>
                <textarea
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Write your secret message..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Secret Code (Optional)
                </label>
                <input
                  type="text"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="e.g., a special date or word..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Timeline / Memory Lane</h2>
            {timeline.map((event, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Event {index + 1}</span>
                  {timeline.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimelineEvent(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Event title..."
                />
                <input
                  type="text"
                  value={event.date}
                  onChange={(e) => updateTimelineEvent(index, 'date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Date..."
                />
                <textarea
                  value={event.description}
                  onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Description..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTimelineEvent}
              className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-semibold"
            >
              <Plus size={20} />
              <span>Add Event</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Love Letter</h2>
            <textarea
              value={loveLetter}
              onChange={(e) => setLoveLetter(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Write your love letter... Use line breaks for paragraphs."
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Promises</h2>
            {promises.map((promise, index) => (
              <div key={index} className="mb-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={promise}
                  onChange={(e) => updatePromise(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder={`Promise ${index + 1}...`}
                />
                {promises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePromise(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPromise}
              className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-semibold"
            >
              <Plus size={20} />
              <span>Add Promise</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Final Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Final Surprise Message *
                </label>
                <textarea
                  value={finalMessage}
                  onChange={(e) => setFinalMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Your closing message..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Background Music URL (Optional)
                </label>
                <input
                  type="url"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="URL to music file..."
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>{pageData ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Heart size={24} fill="currentColor" />
                  <span>{pageData ? 'Update Page' : 'Create Valentine Page'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ValentineFormPage;