import {PageHeader} from '@/components/page-header';
import StandardsClientPage from './standards-client-page';

export default function SurveyStandardsPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <PageHeader
          className="text-center"
          title="Survey Accuracy Standards"
          description="Learn about common tolerance standards and get an AI-powered recommendation for your project."
        />
        <StandardsClientPage />
      </div>
    </div>
  );
}
