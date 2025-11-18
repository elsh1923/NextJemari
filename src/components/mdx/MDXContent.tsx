"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 text-3xl font-bold text-slate-900 dark:text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-2xl font-semibold text-slate-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-slate-700 dark:text-slate-300">{children}</p>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            
            if (isInline) {
              return (
                <code
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800 dark:bg-[#1A1A1C] dark:text-slate-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="my-4 overflow-x-auto">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !m-0"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:border-slate-600 dark:text-slate-400">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="my-4 rounded-lg" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

