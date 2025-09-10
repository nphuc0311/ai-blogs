import 'server-only';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export type PostData = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
  content: string;
};

// A simple frontmatter parser
function parseFrontmatter(fileContents: string): { data: any; content: string } {
  const match = /---\n([\s\S]+?)\n---/.exec(fileContents);
  if (!match) {
    return { data: {}, content: fileContents };
  }

  const frontmatter = match[1];
  const content = fileContents.slice(match[0].length).trim();
  const data: { [key: string]: any } = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      const value = rest.join(':').trim();
      if (key.trim() === 'tags' || key.trim() === 'categories') {
        data[key.trim()] = value.split(',').map(item => item.trim());
      } else {
        data[key.trim()] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  });

  return { data, content };
}


export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(fileContents);

      return {
        slug,
        content,
        ...(data as { title: string; date: string; description: string; tags: string[]; categories: string[] }),
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

export function getPostData(slug: string): PostData {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post with slug "${slug}" not found.`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = parseFrontmatter(fileContents);

  return {
    slug,
    content,
    ...(data as { title: string; date: string; description: string; tags: string[]; categories: string[] }),
  };
}
