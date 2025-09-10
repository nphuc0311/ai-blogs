import 'server-only';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Basic markdown-to-HTML conversion
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Headings with IDs
    .replace(/^(###) (.*$)/gim, (_, level, text) => `<h3 id="${slugify(text)}">${text}</h3>`)
    .replace(/^(##) (.*$)/gim, (_, level, text) => `<h2 id="${slugify(text)}">${text}</h2>`)
    .replace(/^(#) (.*$)/gim, (_, level, text) => `<h1 id="${slugify(text)}">${text}</h1>`)
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\n<ul>/gim, '') // Merge consecutive lists
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
    .replace(/<\/ol>\n<ol>/gim, '') // Merge consecutive lists
    // Bold, Italic, Strikethrough
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/__(.*?)__/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')
    .replace(/~~(.*?)~~/gim, '<del>$1</del>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />');

  // Paragraphs
  html = html
    .split(/\n\n+/)
    .map(p => {
      if (p.match(/<\/?(h[1-3]|ul|ol|blockquote|li)/)) {
        return p;
      }
      return p ? `<p>${p.replace(/\n/g, '<br/>')}</p>` : '';
    })
    .join('');

  return html;
}

export function MarkdownRenderer({ content }: { content: string }) {
  const htmlContent = markdownToHtml(content);

  return <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
