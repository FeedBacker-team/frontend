import { QaBrowse } from '@/components/domain/qa/QaBrowse';
import { QaSidebar } from '@/components/domain/qa/QaSidebar';

export default function QaPage() {
  return (
    <div className="flex gap-10">
      <main className="min-w-0 flex-1">
        <QaBrowse />
      </main>
      <aside className="w-80 shrink-0">
        <QaSidebar />
      </aside>
    </div>
  );
}
