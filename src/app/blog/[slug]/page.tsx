import { getPostData, getAllPostSlugs, parseHeadings } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, Tag, User } from 'lucide-react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TableOfContents } from '@/components/TableOfContents';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostData(slug);
    return {
      title: post.title,
      description: post.description,
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }
}

export function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = getPostData(slug);
  } catch (error) {
    notFound();
  }

  const headings = parseHeadings(post.content);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-col-reverse gap-12 lg:flex-row">
        <article className="w-full lg:w-3/4">
          <header className="mb-8">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <div className="flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <MarkdownRenderer content={post.content} />
        </article>

        <aside className="w-full lg:w-1/4">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
