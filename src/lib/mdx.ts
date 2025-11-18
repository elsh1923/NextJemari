import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkPrism from "remark-prism";

/**
 * Process MDX content and return compiled code
 */
export async function processMDX(content: string) {
  try {
    const compiled = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkPrism as any],
      rehypePlugins: [
        rehypeSlug as any,
        [
          rehypeAutolinkHeadings as any,
          {
            behavior: "wrap",
            properties: {
              className: ["anchor-link"],
            },
          },
        ],
      ],
    });

    return String(compiled);
  } catch (error) {
    console.error("MDX compilation error:", error);
    throw new Error("Failed to process MDX content");
  }
}

/**
 * Extract headings from MDX content
 */
export function extractHeadings(content: string): Array<{
  level: number;
  text: string;
  id: string;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Extract code blocks from MDX content
 */
export function extractCodeBlocks(content: string): Array<{
  language: string;
  code: string;
}> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }

  return codeBlocks;
}

/**
 * Extract images from MDX content
 */
export function extractImages(content: string): string[] {
  const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
  const images: string[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[2]);
  }

  return images;
}

/**
 * Validate MDX content structure
 */
export function validateMDX(content: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for balanced code blocks
  const codeBlockOpen = (content.match(/```/g) || []).length;
  if (codeBlockOpen % 2 !== 0) {
    errors.push("Unclosed code block detected");
  }

  // Check for balanced brackets in links/images
  const linkOpen = (content.match(/\[/g) || []).length;
  const linkClose = (content.match(/\]/g) || []).length;
  if (linkOpen !== linkClose) {
    errors.push("Unbalanced brackets in links/images");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

