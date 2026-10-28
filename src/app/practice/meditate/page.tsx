import { MeditationTimer } from "@/components/meditation-timer";
import { PageHeader, Surface } from "@/components/gamification-ui";
import {
  DHAMMA_PLAYLIST,
  dhammaPlaylistEmbedUrl,
} from "@/lib/dhamma-playlist";

export default function MeditatePage() {
  return (
    <section className="gamify-page">
      <PageHeader
        title="တရားထိုင်ခြင်း"
        description="ထွက်သက်ဝင်သက်ကို အာရုံပြု၍ ထိုင်ပါ"
      />
      <MeditationTimer />

      <Surface className="mt-4 grid gap-3 p-4">
        <div>
          <h2 className="font-display text-xl text-cream">
            {DHAMMA_PLAYLIST.title_mm} · {DHAMMA_PLAYLIST.title}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {DHAMMA_PLAYLIST.description}
          </p>
        </div>
        <div className="overflow-hidden rounded-[var(--radius)] border border-mist bg-bg-deep">
          <div className="relative aspect-video w-full">
            <iframe
              title={DHAMMA_PLAYLIST.title}
              src={dhammaPlaylistEmbedUrl()}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </Surface>
    </section>
  );
}
