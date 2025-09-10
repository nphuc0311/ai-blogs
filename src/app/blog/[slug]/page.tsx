import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = getPostData(params.slug);
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

export default function PostPage({ params }: Props) {
  let post;
  try {
    post = getPostData(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
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
  );
}
