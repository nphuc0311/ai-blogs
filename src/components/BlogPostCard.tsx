import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

type BlogPostCardProps = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

export function BlogPostCard({ slug, title, date, description, tags }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            {title}
            <ArrowUpRight className="ml-2 inline h-4 w-4 transform transition-transform duration-300 group-hover:rotate-45" />
          </CardTitle>
          <CardDescription>{format(new Date(date), 'MMMM d, yyyy')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
