import Prism from 'prismjs';
import parse, { domToReact } from "html-react-parser";
import Image from 'next/image';
import './MarkdownRenderer.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css';

// Convert text to slug for IDs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Convert Markdown to HTML
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // --- Code block (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, (_, lang, code) => {
    const language = lang?.toLowerCase() || 'text';
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const highlighted = language !== 'text' 
      ? Prism.highlight(escaped, Prism.languages[language] || Prism.languages.text, language)
      : escaped;
    return `<pre class="code-block"><code class="language-${language}">${highlighted}</code></pre>`;
  });

  // --- Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // --- Headings h1 → h6
  for (let i = 6; i >= 1; i--) {
    const regex = new RegExp(`^${'#'.repeat(i)} (.*$)`, 'gim');
    html = html.replace(regex, (_, text) => `<h${i} id="${slugify(text)}">${text}</h${i}>`);
  }

  // --- Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/gim, ''); // Merge consecutive lists

  // --- Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\n<ol>/gim, ''); // Merge consecutive lists

  // --- Bold, Italic, Strikethrough
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
  html = html.replace(/(^|[\s])_(.+?)_(?=[\s]|$)/gim, '$1<em>$2</em>');
  html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

  // --- Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // --- Images
  html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, (_, alt, src) => {
    return `<next-img alt="${alt}" src="${src}" />`;
  });

  // --- Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // --- Paragraphs
  html = html
    .split(/\n\n+/)
    .map(p => {
      if (p.match(/<\/?(h[1-6]|ul|ol|blockquote|li|pre|img|code|a)/)) {
        return p;
      }
      return p ? `<p>${p.replace(/\n/g, '<br/>')}</p>` : '';
    })
    .join('');

  return html;
}

// --- Component MarkdownRenderer
export function MarkdownRenderer({ content }: { content: string }) {
  const htmlContent = markdownToHtml(content);

  return (
    <div className="prose dark:prose-invert max-w-none">
      {parse(htmlContent, {
        replace: (domNode: any) => {
          if (domNode.name === "next-img") {
            const { src, alt } = domNode.attribs;
            return (
              <div className="my-4">
                <Image
                  src={src}
                  alt={alt}
                  width={800}
                  height={400}
                  className="rounded-md shadow-md object-contain w-full h-auto"
                />
              </div>
            );
          }
        },
      })}
    </div>
  );
}
