
import { PageHeader } from '@/components/page-header';
import UnitConverterClientPage from './unit-converter-client-page';

export default function UnitConverterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Historical Unit Converter"
        description="Convert historical surveying units (Chains, Rods, Links) to modern standards."
      />
      <UnitConverterClientPage />
    </div>
  );
}
