import { generateIntelligentArchive } from '@/ai/flows/intelligent-archive';
import path from 'path';

export const metadata = {
  title: 'Archive',
  description: 'An intelligently organized archive of all posts on AI Chronicle.',
};

export default async function ArchivePage() {
  const blogPostDirectory = path.join(process.cwd(), 'src/posts');
  const { archiveContent } = await generateIntelligentArchive({ blogPostDirectory });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Blog Archive
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          An AI-curated collection of our articles, organized for easy browsing.
        </p>
      </header>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: archiveContent }}
      />
    </div>
  );
}
