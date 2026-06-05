import StoryForm from './StoryForm';

export default function Chatbot({ currentPin }) {
  const lat = Array.isArray(currentPin) ? currentPin[0] : null;
  const lng = Array.isArray(currentPin) ? currentPin[1] : null;

  return (
    <div className="flex h-full flex-col gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,15,32,0.96),rgba(2,6,23,0.98))] p-4 shadow-[0_18px_42px_rgba(8,15,32,0.53)] backdrop-blur-xl">
      <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,1))] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Community input</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Story submission panel</h2>
        <p className="mt-2 text-sm text-slate-300">Capture local survival experiences and route them to the backend with a polished, dark-mode flow.</p>
      </div>
      <StoryForm latitude={lat} longitude={lng} />
    </div>
  );
}