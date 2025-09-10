"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Heading } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    let currentId: string | null = null;
    let currentTop = Infinity;

    for (const heading of headings) {
      const element = document.getElementById(heading.slug);
      if (element) {
        const rect = element.getBoundingClientRect();
        // 120px offset to account for sticky header and give some buffer
        if (rect.top >= 0 && rect.top < 120 && rect.top < currentTop) {
          currentTop = rect.top;
          currentId = heading.slug;
        }
      }
    }
    
    // Fallback to the first heading if nothing is active in the viewport
    if(currentId === null && headings.length > 0) {
      const firstElement = document.getElementById(headings[0].slug);
      if (firstElement && firstElement.getBoundingClientRect().top > 120) {
         // If we are above the first heading, no item is active
      } else {
        // Find last visible one
        for (let i = headings.length - 1; i >= 0; i--) {
            const element = document.getElementById(headings[i].slug);
            if (element && element.getBoundingClientRect().top < 120) {
                currentId = headings[i].slug;
                break;
            }
        }
      }
    }

    setActiveId(currentId);
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="p-4 rounded-lg border bg-card">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
        <List className="h-5 w-5" />
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className={cn(
                'text-sm transition-colors hover:text-primary',
                heading.level === 3 && 'pl-4',
                activeId === heading.slug
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
