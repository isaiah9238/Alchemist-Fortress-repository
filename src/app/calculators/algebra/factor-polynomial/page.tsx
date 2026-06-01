import {PageHeader} from '@/components/page-header';
import FactorPolynomialClientPage from './factor-polynomial-client-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function FactorPolynomialPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        <div className="flex flex-col items-center space-y-4">
          <PageHeader
            className="text-center"
            title="Factor Polynomial"
            description="Factor a polynomial expression using AI."
          />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/learn/calculus">
              <HelpCircle className="mr-2 h-4 w-4" />
              Learn about Polynomials
            </Link>
          </Button>
        </div>
        <div className="text-left">
          <FactorPolynomialClientPage />
        </div>
      </div>
    </div>
  );
}
