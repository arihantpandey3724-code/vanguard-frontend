import { useEffect, useState } from 'react';
import { getStories } from '../apiClient';

export default function StoryList({ selectedStoryId, onSelectStory }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadStories() {
      setLoading(true);
      setError('');

      try {
        const data = await getStories();
        if (mounted) {
          setStories(Array.isArray(data) ? data : data?.stories || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load community stories.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,15,32,0.98),rgba(2,6,23,0.98))] p-6 text-slate-100 shadow-[0_24px_60px_rgba(8,15,32,0.55)] backdrop-blur-xl animate-slide-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Community</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Live story feed</h2>
        </div>
        <div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-100">Backend driven</div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">Loading stories from the API…</div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-100">{error}</div>
      ) : null}

      {!loading && !error && stories.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">No stories are available yet. Submit the first one from the panel.</div>
      ) : null}

      <div className="mt-6 space-y-4">
        {stories.map((story, index) => (
          <article
            key={story.id || `${story.author_name}-${index}`}
            onClick={() => onSelectStory?.(story.id || `${story.author_name}-${index}`)}
            className={`cursor-pointer rounded-[26px] border p-5 shadow-[0_16px_36px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 ${selectedStoryId === (story.id || `${story.author_name}-${index}`) ? 'border-cyan-400/40 bg-[linear-gradient(145deg,rgba(14,165,233,0.12),rgba(2,6,23,1))]' : 'border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-cyan-100">{story.author_name || 'Anonymous community voice'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{story.location || 'Location pending'}</p>
                <p className="mt-3 text-xs text-slate-300">Community note from the latest backend story collection.</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-100">Story #{index + 1}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-200">{story.story_text || 'No story text returned.'}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1">Lat {story.latitude ?? '—'}</span>
              <span className="rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1">Lng {story.longitude ?? '—'}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
