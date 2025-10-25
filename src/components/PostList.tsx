'use client';

import { useState, useMemo } from 'react';
import type { PostData } from '@/lib/posts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PostListProps = {
  posts: PostData[];
};

export function PostList({ posts }: PostListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const allCategories = posts.flatMap(post => post.categories || []);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === 'all' ||
        post.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <>
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all'
                      ? 'All Categories'
                      : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(({ slug, title, date, description, tags }) => (
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
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-foreground">No Posts Found</h2>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </>
  );
}