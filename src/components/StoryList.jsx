export default function StoryList({ stories = [], selectedStoryId, onSelectStory }) {
  return (
    // Container: Warm Alabaster/Oatmeal background with Deep Forest Green text
    <section className="rounded-[30px] border border-[#162B22]/15 bg-[#F4F3EE] p-6 text-[#162B22] shadow-lg backdrop-blur-md animate-slide-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          {/* Olive Green Subheader */}
          <p className="text-xs uppercase tracking-[0.35em] text-[#6B8E23] font-bold">Community</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#162B22]">Live story feed</h2>
        </div>
        {/* Terracotta Accent Badge */}
        <div className="rounded-full border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-1 text-xs font-bold text-[#C85A3F]">Backend driven</div>
      </div>

      {stories.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-[#6B8E23]/30 bg-white p-5 text-sm font-medium text-[#162B22]">No stories are available yet. Submit the first one from the panel.</div>
      ) : null}

      <div className="mt-6 space-y-4">
        {stories.map((story, index) => (
          <article
            key={story.id || `${story.author_name}-${index}`}
            onClick={() => onSelectStory?.(story.id || `${story.author_name}-${index}`)}
            className={`cursor-pointer rounded-[26px] border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStoryId === (story.id || `${story.author_name}-${index}`) 
                ? 'border-[#162B22] bg-[#E9EED9]' // Active: Soft Sage background, Deep Forest border
                : 'border-stone-200 bg-white hover:border-[#6B8E23]/50' // Inactive: Crisp Icy White
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {/* Rich Espresso Brown Name */}
                <p className="text-sm font-bold text-[#3E2723]">{story.author_name || 'Anonymous community voice'}</p>
                {/* Terracotta Location */}
                <p className="mt-1 text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F]">{story.location || 'Location pending'}</p>
                <p className="mt-3 text-xs text-[#162B22]/70 font-medium">Community note from the latest backend story collection.</p>
              </div>
              
              {/* Story # Tag */}
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                selectedStoryId === (story.id || `${story.author_name}-${index}`)
                  ? 'border-[#006064] bg-[#006064] text-white' // Deep Oceanic Teal when selected
                  : 'border-[#162B22]/20 bg-[#162B22]/5 text-[#162B22]'
              }`}>Story #{index + 1}</span>
            </div>
            
            {/* Rich Espresso Brown Body Text */}
            <p className="mt-4 text-sm leading-6 text-[#2C1E16] font-medium">{story.story_text || 'No story text returned.'}</p>
            
            {/* Coordinate Tags: Icy Blue Backgrounds with Oceanic Teal Text */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="rounded-full border border-[#B2EBF2] bg-[#E0F7FA] text-[#006064] px-3 py-1">Lat {story.latitude ?? '—'}</span>
              <span className="rounded-full border border-[#B2EBF2] bg-[#E0F7FA] text-[#006064] px-3 py-1">Lng {story.longitude ?? '—'}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}