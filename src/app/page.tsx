import { getSortedPostsData } from '@/lib/posts';
import { BlogPostCard } from '@/components/BlogPostCard';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          AI Chronicle
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Exploring the frontiers of Artificial Intelligence. Insights, tutorials, and discussions on the latest in AI/ML.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allPostsData.map(({ slug, title, date, description, tags }) => (
          <BlogPostCard
            key={slug}
            slug={slug}
            title={title}
            date={date}
            description={description}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
}
