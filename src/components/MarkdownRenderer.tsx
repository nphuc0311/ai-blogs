import Prism from 'prismjs';
import parse, { domToReact } from "html-react-parser";
import Image from 'next/image';
import katex from "katex";
import "katex/dist/katex.min.css";

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

// Render LaTeX bằng KaTeX
function renderMath(expr: string, displayMode = false): string {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      displayMode,
    });
  } catch (err) {
    console.error("KaTeX render error:", err);
    return expr;
  }
}

// Convert Markdown to HTML
function markdownToHtml(markdown: string): string {
  let html = markdown || '';

  // --- Code block (```) — highlight and produce <pre><code>
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, (_, lang, code) => {
    const language = (lang || 'text').toLowerCase();
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const highlighted = language !== 'text'
      ? Prism.highlight(escaped, Prism.languages[language] || Prism.languages.text, language)
      : escaped;
    return `<pre class="code-block" data-lang="${language}"><code class="language-${language}">${highlighted}</code></pre>`;
  });

  // --- Math block $$
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    return `<div class="math-block">${renderMath(expr, true)}</div>`;
  });

  // --- Inline math $ (avoid escaped \$)
  html = html.replace(/(?<!\\)\$(.+?)\$/g, (_, expr) => {
    return `<span class="math-inline">${renderMath(expr, false)}</span>`;
  });

  // --- Headings (h1..h6)
  for (let i = 6; i >= 1; i--) {
    const regex = new RegExp(`^${'#'.repeat(i)} (.*$)`, 'gim');
    html = html.replace(regex, (_, text) => `<h${i} id="${slugify(text)}">${text}</h${i}>`);
  }

  // --- Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // --- Lists (simple)
  html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/gim, '');
  html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\n<ol>/gim, '');

  // --- Inline formatting
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/(^|[\s])_(.+?)_(?=[\s]|$)/gim, '$1<em>$2</em>');
  html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // --- Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (_, alt, src) => {
    return `<figure class="image-block">
              <img alt="${alt}" src="${src}" class="rounded-md shadow-md object-contain w-full h-auto" />
              ${alt ? `<figcaption class="caption">${alt}</figcaption>` : ''}
            </figure>`;
  });

  // --- Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // --- Tables: scan lines and convert table blocks robustly
  const lines = html.split(/\r?\n/);
  const outLines: string[] = [];
  let i = 0;

  const isSeparatorLine = (s: string) => {
    // line made of pipes, spaces, colons, dashes (e.g. |---|:---:|---|)
    return /^\s*\|?\s*[:\-]+\s*(\|\s*[:\-]+\s*)*\|?\s*$/.test(s);
  };

  const splitCells = (line: string) => {
    const cells = line.split('|').map(c => c.trim());
    // remove empty leading/trailing cell if due to leading/trailing | 
    if (cells.length > 0 && cells[0] === '') cells.shift();
    if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
    return cells;
  };

  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1] ?? '';

    // detect a header line (contains |) and next line is separator
    if (line.includes('|') && isSeparatorLine(next)) {
      const headerLine = line;
      const bodyLines: string[] = [];

      i += 2; // skip header + separator
      // collect following lines that look like table rows (contain |) until a blank line or non-pipe line
      while (i < lines.length && lines[i].trim() !== '' && (lines[i].includes('|') || /^\s*$/.test(lines[i]) === false)) {
        // stop when the line obviously is not a table row: it should contain '|' or be non-empty but we still check presence of '|'
        if (!lines[i].includes('|')) break;
        bodyLines.push(lines[i]);
        i++;
      }

      // build HTML table
      const headers = splitCells(headerLine);
      const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
      const rowsHtml = bodyLines
        .map(r => {
          const cells = splitCells(r);
          const cellHtml = cells.map(c => `<td>${c}</td>`).join('');
          return `<tr>${cellHtml}</tr>`;
        })
        .join('');
      const tableHtml = `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;

      outLines.push(tableHtml);
      continue; // continue main loop (i already points to first non-table line)
    }

    // not a table start — just push the original line
    outLines.push(line);
    i++;
  }

  html = outLines.join('\n');

  // --- Paragraphs (protect block-level elements so split won't break them)
  const protectedBlocks: Record<string, string> = {};
  let blockCounter = 0;
  const stash = (match: string) => {
    const key = `@@BLOCK_${blockCounter++}@@`;
    protectedBlocks[key] = match;
    return key;
  };

  html = html.replace(/<pre[\s\S]*?<\/pre>/gim, stash);
  html = html.replace(/<table[\s\S]*?<\/table>/gim, stash);
  html = html.replace(/<figure[\s\S]*?<\/figure>/gim, stash);
  html = html.replace(/<div class="math-block"[\s\S]*?<\/div>/gim, stash);

  html = html
    .split(/\n\n+/)
    .map(p => {
      if (p.match(/<\/?(h[1-6]|ul|ol|blockquote|li|pre|img|code|a|div|span|table|figure|thead|tbody|tr|td|th)/i)) {
        return p;
      }
      return p ? `<p>${p.replace(/\n/g, '<br/>')}</p>` : '';
    })
    .join('\n\n');

  // restore protected blocks
  Object.keys(protectedBlocks).forEach((key) => {
    html = html.replace(key, protectedBlocks[key]);
  });

  return html;
}



// --- Component MarkdownRenderer
export function MarkdownRenderer({ content }: { content: string }) {
  const htmlContent = markdownToHtml(content);

  // // Debugging: Log the generated HTML content
  // console.log("Generated HTML:", htmlContent);
  
  return (
    <div className="prose dark:prose-invert max-w-none">
      {parse(htmlContent, {
        replace: (domNode: any) => {
          if (domNode.name === "next-img") {
            const { src, alt } = domNode.attribs;
            if (!src || !alt) {
              console.error("Missing src or alt attribute in next-img tag", domNode.attribs);
              return null; // Skip rendering this tag
            }
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

          if (domNode.name === "figcaption") {
            return (
              <figcaption className="caption">
                {domToReact(domNode.children)}
              </figcaption>
            );
          }
        },
      })}
    </div>
  );
}
