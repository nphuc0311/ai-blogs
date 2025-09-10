import { getSortedPostsData } from '@/lib/posts';
import { PostList } from '@/components/PostList';
import { Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';

function PostListFallback() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading posts...</p>
    </div>
  );
}


export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          AI Chronicle
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Exploring the frontiers of Artificial Intelligence. Insights,
          tutorials, and discussions on the latest in AI/ML.
        </p>
      </header>
      <Suspense fallback={<PostListFallback />}>
        <PostList posts={allPostsData} />
      </Suspense>
    </div>
  );
}
