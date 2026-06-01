
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Parabola Report',
      description: 'A detailed analysis of the geometric and calculus properties of a standard parabola.',
      href: '/reports/parabola',
      icon: <FilePieChart className="mb-4 h-8 w-8 text-primary" />,
    },
    {
      title: 'Vertical Curve Report',
      description: 'An analysis of the properties of a symmetrical parabolic vertical curve used in roadway design.',
      href: '/reports/vertical-curve',
      icon: <TrendingUp className="mb-4 h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <PageHeader
          title="Lab Reports"
          description="Detailed analysis and summaries generated from the Interactive Labs."
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((doc) => (
          <Card key={doc.href} className="flex flex-col">
            <CardHeader>
                {doc.icon}
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={doc.href}>View Report</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
