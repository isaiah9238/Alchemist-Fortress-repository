import { PageHeader } from '@/components/page-header';
import InteractiveDemoClientPage from './interactive-client-page';

export default function InteractiveDemoPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10 bg-background">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Graphs & Labs"
            description="An interactive workspace where multiple functions can be plotted and controlled."
          />
        </div>
        <div className="w-full text-left">
          <InteractiveDemoClientPage />
        </div>
      </div>
    </div>
  );
}