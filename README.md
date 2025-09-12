# AI Blog Platform

A modern, responsive AI blog platform built with Next.js, Tailwind CSS, and TypeScript. Easily add new Markdown posts, enjoy beautiful code highlighting, and benefit from SEO and mobile-friendly design.

## Project Structure

```
ai-blogs/
├── src/
│   ├── app/                # Next.js app directory (routing, layout, pages)
│   ├── components/         # UI and blog components (MarkdownRenderer, Header, Footer, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Blog logic (post loading, parsing, utils)
│   ├── posts/              # Markdown blog posts
│   └── styles/             # Global and component CSS
├── public/                 # Static assets (favicons, images, etc.)
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration (image domains, etc.)
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) (or the port shown in your terminal).

## Adding a New Blog Post

1. Create a new `.md` file in `src/posts/`.
2. Use YAML frontmatter for metadata:
	```markdown
	---
	title: "Your Post Title"
	date: "2025-09-13"
	author: "Your Name"
	description: "Short summary of the post."
	tags: ai, tutorial, example
	categories: General
	---
	```
3. Write your content in Markdown. Images and code blocks are supported.

## Customization

- **Styling:** Edit `tailwind.config.ts` and `globals.css` for colors, fonts, and layout.
- **Components:** Extend or replace components in `src/components/`.
- **Image Domains:** Add allowed domains in `next.config.ts` for external images.

## Deployment

- **Firebase Hosting:** Ready for Firebase Studio and Firebase Hosting.
- **Other Platforms:** Standard Next.js deployment supported (Vercel, Netlify, etc.).

## License

MIT
