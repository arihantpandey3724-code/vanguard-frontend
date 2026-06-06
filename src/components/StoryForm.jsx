import { useState } from 'react';
import { submitStory } from '../apiClient';

export default function StoryForm({ latitude = null, longitude = null, onSubmitted, onLocationSelect }) {
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [storyText, setStoryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // --- NEW: Geolocation State ---
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // --- NEW: HTML5 Geolocation Logic ---
  const handleLiveLocation = (e) => {
    e.preventDefault(); 
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // Send coordinates back up to App.jsx to move the map pin
        if (onLocationSelect) {
          onLocationSelect(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        setIsLocating(false);
        setGeoError("Location permission denied. Please allow access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authorName.trim() || !location.trim() || !storyText.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all fields before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await submitStory({
        author_name: authorName.trim(),
        latitude,
        longitude,
        location: location.trim(),
        story_text: storyText.trim(),
      });

      setStatus({ type: 'success', message: 'Story verified and added to the public map.' });
      setAuthorName('');
      setLocation('');
      setStoryText('');
      onSubmitted?.();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to submit your story right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in rounded-[30px] border border-[#162B22]/15 bg-[#F4F3EE] p-6 text-[#162B22] shadow-lg backdrop-blur-md"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#6B8E23] font-bold">Vanguard Earth</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#162B22]">Share a survival story</h2>
          <p className="mt-2 text-sm text-[#162B22]/70 font-medium">Add a firsthand note tied to the selected map point so the community feed stays current.</p>
        </div>
        <div className="rounded-full border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-1 text-xs font-bold text-[#C85A3F]">Live submission</div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#162B22]">
          Author name
          <input
            type="text"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#162B22]/20 bg-white px-4 py-3 text-sm font-medium text-[#2C1E16] placeholder-[#162B22]/40 transition-colors focus:border-[#6B8E23] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/20"
            placeholder="Enter your name"
          />
        </label>

        <label className="block text-sm font-bold text-[#162B22]">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#162B22]/20 bg-white px-4 py-3 text-sm font-medium text-[#2C1E16] placeholder-[#162B22]/40 transition-colors focus:border-[#6B8E23] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/20"
            placeholder="City or region"
          />
        </label>

        <label className="block text-sm font-bold text-[#162B22]">
          Story text
          <textarea
            rows="5"
            value={storyText}
            onChange={(event) => setStoryText(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#162B22]/20 bg-white px-4 py-3 text-sm font-medium text-[#2C1E16] placeholder-[#162B22]/40 transition-colors focus:border-[#6B8E23] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/20 resize-none"
            placeholder="Describe what happened, what you adapted, and how your community survived."
          />
        </label>

        {/* --- UPGRADED: Coordinates Section --- */}
        <div className="rounded-2xl border border-[#162B22]/15 bg-white/50 p-4 text-sm shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-3">
            <p className="font-bold text-[#162B22]">Selected coordinates</p>
            
            {/* Live Location Button styled to match your theme */}
            <button
              onClick={handleLiveLocation}
              disabled={isLocating}
              className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-[#6B8E23]/30 bg-[#6B8E23]/10 text-[#6B8E23] hover:bg-[#6B8E23]/20 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <div className="w-1.5 h-1.5 bg-[#6B8E23] rounded-full animate-ping"></div>
                  LOCATING...
                </>
              ) : (
                '📍 DETECT LIVE'
              )}
            </button>
          </div>

          {/* Geo Error Display */}
          {geoError && (
            <p className="mb-2 text-xs font-semibold text-[#E07A5F]">{geoError}</p>
          )}

          <p className="mt-1 font-medium text-[#162B22]/70">
            {latitude !== null && longitude !== null
              ? <span className="inline-flex items-center gap-1 rounded-full border border-[#B2EBF2] bg-[#E0F7FA] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#006064]">
                  Lat {latitude.toFixed(6)} · Lng {longitude.toFixed(6)}
                </span>
              : 'Choose a location on the map to enable story submission.'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || latitude === null || longitude === null}
          className="mt-2 w-full rounded-xl bg-[#162B22] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#006064] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Verifying with AI...
            </span>
          ) : (
            'Submit story'
          )}
        </button>

        {status.message ? (
          <p
            className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
              status.type === 'success'
                ? 'border-[#6B8E23]/30 bg-[#E9EED9] text-[#162B22]'
                : 'border-[#E07A5F]/40 bg-[#E07A5F]/10 text-[#C85A3F]'
            } animate-slide-up`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}