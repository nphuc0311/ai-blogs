import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata = {
  title: 'Archive',
  description: 'A complete archive of all posts on AI Chronicle.',
};

export default function ArchivePage() {
  const allPostsData = getSortedPostsData();

  const postsByYear: { [year: string]: typeof allPostsData } = {};

  allPostsData.forEach(post => {
    const year = format(new Date(post.date), 'yyyy');
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });

  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Blog Archive
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          All our articles, organized by year.
        </p>
      </header>
      <div className="space-y-12">
        {sortedYears.map(year => (
          <section key={year}>
            <h2 className="text-3xl font-bold border-b pb-2 mb-6 text-primary">
              {year}
            </h2>
            <ul className="space-y-4">
              {postsByYear[year].map(post => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(post.date), 'MMMM d')}
                      </p>
                    </div>
                    <p className="text-muted-foreground mt-1">{post.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
