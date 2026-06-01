import {PageHeader} from '@/components/page-header';
import LevelNotesClientPage from './level-notes-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function LevelNotesPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <PageHeader
            title="Level Notes"
            description="Input your level notes below to calculate elevations and check for loop misclosure."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/vertical-calculations">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Differential Leveling
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <LevelNotesClientPage />
        </div>
      </div>
    </div>
  );
}
