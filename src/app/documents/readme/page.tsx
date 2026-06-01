
import {PageHeader} from '@/components/page-header';
import {Card, CardContent} from '@/components/ui/card';
import {promises as fs} from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ReadmePage() {
  // Find the absolute path to the README.md file
  const readmePath = path.join(process.cwd(), 'README.md');
  let readmeContent = '';

  try {
    readmeContent = await fs.readFile(readmePath, 'utf8');
  } catch (error) {
    console.error('Could not read README.md:', error);
    readmeContent = '# README Not Found\n\nCould not load the `README.md` file.';
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project README"
        description="An overview of the ArithmaGen application, its features, and the technology used."
      />
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 border-b pb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="pl-4 italic border-l-4 my-4" {...props} />,
              }}
            >
                {readmeContent}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
