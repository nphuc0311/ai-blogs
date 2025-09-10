// src/ai/flows/intelligent-archive.ts
'use server';

/**
 * @fileOverview Dynamically and intelligently populates the archive page.
 *
 * - generateIntelligentArchive - A function that generates the intelligent archive content.
 * - GenerateIntelligentArchiveInput - The input type for the generateIntelligentArchive function.
 * - GenerateIntelligentArchiveOutput - The return type for the generateIntelligentArchive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fs from 'fs/promises';
import path from 'path';

const GenerateIntelligentArchiveInputSchema = z.object({
  blogPostDirectory: z
    .string()
    .describe(
      'The directory containing the blog post markdown files.'
    ),
});
export type GenerateIntelligentArchiveInput =
  z.infer<typeof GenerateIntelligentArchiveInputSchema>;

const GenerateIntelligentArchiveOutputSchema = z.object({
  archiveContent: z
    .string()
    .describe(
      'The generated content for the archive page, including categories, tags, and links to blog posts.'
    ),
});
export type GenerateIntelligentArchiveOutput =
  z.infer<typeof GenerateIntelligentArchiveOutputSchema>;

export async function generateIntelligentArchive(
  input: GenerateIntelligentArchiveInput
): Promise<GenerateIntelligentArchiveOutput> {
  return generateIntelligentArchiveFlow(input);
}

const analyzeBlogPosts = ai.defineTool(
  {
    name: 'analyzeBlogPosts',
    description:
      'Analyzes the blog posts in the specified directory and extracts relevant metadata, including title, description, publication date, categories, and tags.',
    inputSchema: z.object({
      blogPostDirectory: z
        .string()
        .describe(
          'The directory containing the blog post markdown files.'
        ),
    }),
    outputSchema: z.array(z.object({
      title: z.string(),
      description: z.string(),
      publicationDate: z.string(),
      categories: z.array(z.string()),
      tags: z.array(z.string()),
      filePath: z.string(),
    })),
  },
  async input => {
    const blogPostDirectory = input.blogPostDirectory;
    const files = await fs.readdir(blogPostDirectory);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const posts = [];
    for (const file of markdownFiles) {
      const filePath = path.join(blogPostDirectory, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // Extract metadata from the markdown file (e.g., using regex or a markdown parsing library).
      // This is a simplified example; you may need a more robust solution.
      const titleMatch = /#\s*(?<title>[^\n]+)/.exec(fileContent);
      const descriptionMatch = />\s*(?<description>[^\n]+)/.exec(fileContent);
      const publicationDateMatch = /date:\s*(?<date>[^\n]+)/.exec(fileContent);
      const categoriesMatch = /categories:\s*(?<categories>[^\n]+)/.exec(fileContent);
      const tagsMatch = /tags:\s*(?<tags>[^\n]+)/.exec(fileContent);

      const title = titleMatch?.groups?.title || 'Untitled';
      const description = descriptionMatch?.groups?.description || '';
      const publicationDate = publicationDateMatch?.groups?.date || '';

      const categoriesString = categoriesMatch?.groups?.categories || '';
      const categories = categoriesString.split(',').map(c => c.trim());

      const tagsString = tagsMatch?.groups?.tags || '';
      const tags = tagsString.split(',').map(t => t.trim());

      posts.push({
        title,
        description,
        publicationDate,
        categories,
        tags,
        filePath,
      });
    }

    return posts;
  }
);

const prompt = ai.definePrompt({
  name: 'generateIntelligentArchivePrompt',
  tools: [analyzeBlogPosts],
  input: {schema: GenerateIntelligentArchiveInputSchema},
  output: {schema: GenerateIntelligentArchiveOutputSchema},
  prompt: `You are an expert content manager responsible for creating an intelligent archive page for a website containing AI-related blog posts. Analyze the available blog posts and create well-organized archive content, including categories, tags, and links to the blog posts. Use the analyzeBlogPosts tool to get the blog post metadata.

  The archive page should:
  - Be well-organized and easy to navigate.
  - Group blog posts by category and tag.
  - Include a brief description of each blog post.
  - Link to the full blog post.
  - Be SEO-friendly.

  Follow these steps:
  1. Call the analyzeBlogPosts tool to get the blog post metadata from the directory: {{{blogPostDirectory}}}.
  2. Analyze the metadata and identify the main categories and tags.
  3. Generate HTML content that displays the archive in a structured format.

  Make sure to include proper HTML tags for headings, lists, and links.
  Return ONLY the HTML code, no other text.
  `,
});

const generateIntelligentArchiveFlow = ai.defineFlow(
  {
    name: 'generateIntelligentArchiveFlow',
    inputSchema: GenerateIntelligentArchiveInputSchema,
    outputSchema: GenerateIntelligentArchiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
