'use server';

/**
 * @fileOverview AI-powered intelligent tagging for blog posts.
 *
 * This file defines a Genkit flow that automatically categorizes and tags new AI blog posts
 * for improved searchability, archive display, and content discoverability. The flow uses an LLM
 * to analyze the blog post content and generate relevant categories, tags and description.
 *
 * - intelligentTagging - An async function that takes blog post content as input and returns
 *   the categorized tags and description.
 * - IntelligentTaggingInput - The input type for the intelligentTagging function.
 * - IntelligentTaggingOutput - The return type for the intelligentTagging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTaggingInputSchema = z.object({
  blogContent: z
    .string()
    .describe('The complete content of the AI blog post in markdown format.'),
  title: z.string().describe('The title of the AI blog post.'),
});
export type IntelligentTaggingInput = z.infer<typeof IntelligentTaggingInputSchema>;

const IntelligentTaggingOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('A list of categories that best describe the blog post.'),
  tags: z
    .array(z.string())
    .describe('A list of relevant tags for the blog post, for example: ai, llm, genkit.'),
  description: z
    .string()
    .describe(
      'A short and concise description of the blog post, suitable for search engine snippets and archive listings.'
    ),
});
export type IntelligentTaggingOutput = z.infer<typeof IntelligentTaggingOutputSchema>;

export async function intelligentTagging(
  input: IntelligentTaggingInput
): Promise<IntelligentTaggingOutput> {
  return intelligentTaggingFlow(input);
}

const intelligentTaggingPrompt = ai.definePrompt({
  name: 'intelligentTaggingPrompt',
  input: {schema: IntelligentTaggingInputSchema},
  output: {schema: IntelligentTaggingOutputSchema},
  prompt: `You are an AI blog post categorization expert. Analyze the content of the blog post and generate appropriate categories, tags, and a concise description.

Title: {{{title}}}

Content:
{{{blogContent}}}

Categories: (Provide at least three relevant categories)
Tags: (Provide at least five relevant tags)
Description: (Write a brief description of the blog post in under 160 characters)

Ensure that the categories and tags are specific and relevant to the content, and that the description accurately summarizes the blog post for search engine optimization.

Output in JSON format.`,
});

const intelligentTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentTaggingFlow',
    inputSchema: IntelligentTaggingInputSchema,
    outputSchema: IntelligentTaggingOutputSchema,
  },
  async input => {
    const {output} = await intelligentTaggingPrompt(input);
    return output!;
  }
);
