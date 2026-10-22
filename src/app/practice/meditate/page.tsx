import { MeditationTimer } from "@/components/meditation-timer";
import { PageHeader } from "@/components/gamification-ui";

export default function MeditatePage() {
  return (
    <section className="gamify-page">
      <PageHeader
        title="တရားထိုင်ခြင်း"
        description="ထွက်သက်ဝင်သက်ကို အာရုံပြု၍ ထိုင်ပါ"
      />
      <MeditationTimer />
    </section>
  );
}
