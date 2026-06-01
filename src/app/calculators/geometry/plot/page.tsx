
import { PageHeader } from '@/components/page-header';
import PlotClientPage from './plot-client-page';

export default function PlotPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Coordinate Plot"
        description="A visual representation of the two points and the line between them."
      />
      <PlotClientPage />
    </div>
  );
}
