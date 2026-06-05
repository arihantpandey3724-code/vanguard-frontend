import { useState } from 'react';
import { submitStory } from '../apiClient';

export default function StoryForm({ latitude = null, longitude = null }) {
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [storyText, setStoryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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

      setStatus({ type: 'success', message: 'Story submitted successfully.' });
      setAuthorName('');
      setLocation('');
      setStoryText('');
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
      className="animate-fade-in rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(8,15,32,0.96),rgba(2,6,23,0.98))] p-6 text-slate-100 shadow-[0_24px_55px_rgba(8,15,32,0.55)] backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Vanguard Earth</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Share a survival story</h2>
          <p className="mt-2 text-sm text-slate-300">Add a firsthand note tied to the selected map point so the community feed stays current.</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">Live submission</div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm text-slate-300">
          Author name
          <input
            type="text"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Enter your name"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="City or region"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Story text
          <textarea
            rows="5"
            value={storyText}
            onChange={(event) => setStoryText(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Describe what happened, what you adapted, and how your community survived."
          />
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 shadow-[0_10px_24px_rgba(15,23,42,0.35)]">
          <p className="font-medium text-slate-100">Selected coordinates</p>
          <p className="mt-1 text-slate-400">{latitude !== null && longitude !== null ? `Latitude: ${latitude} · Longitude: ${longitude}` : 'Choose a location on the map to enable story submission.'}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || latitude === null || longitude === null}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(56,189,248,0.25)] transition hover:scale-[1.01] hover:shadow-[0_18px_35px_rgba(56,189,248,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit story'
          )}
        </button>

        {status.message ? (
          <p
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                : 'border-rose-400/30 bg-rose-400/10 text-rose-100'
            } animate-slide-up`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
