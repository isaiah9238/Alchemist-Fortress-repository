
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const documents = [
    {
      title: 'Project README',
      description: 'An overview of the ArithmaGen application, its features, and the technology used.',
      href: '/documents/readme',
      icon: <BookOpen className="mb-4 h-8 w-8 text-primary" />,
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data.',
      href: '/documents/privacy',
      icon: <Shield className="mb-4 h-8 w-8 text-primary" />,
    },
    {
      title: 'Terms of Service',
      description: 'The rules and guidelines for using our application.',
      href: '/documents/terms',
      icon: <FileText className="mb-4 h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <PageHeader
          title="Documents"
          description="Legal documents and project information for ArithmaGen."
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.href} className="flex flex-col">
            <CardHeader>
                {doc.icon}
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={doc.href}>View Document</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
