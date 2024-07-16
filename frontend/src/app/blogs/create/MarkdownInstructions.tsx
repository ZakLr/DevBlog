import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const customComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="text-5xl font-bold text-highlight underline decoration-4 underline-offset-8 italic p-5"
      {...props}
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-4xl font-bold text-text-secondary underline underline-offset-8 p-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-secondary p-4" {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-secondary p-4" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-lg leading-relaxed text-text-primary p-3" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc pl-10 py-2" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="py-1 mx-6" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="pl-4 border-l-4 border-gray-400 italic py-2"
      {...props}
    />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="bg-gray-100 rounded p-1 text-sm" {...props} />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre className=" text-white  rounded-lg overflow-x-auto" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="w-full max-h-96 rounded-lg shadow-lg mx-auto" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-text-third hover:text-blue-700 underline" {...props} />
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <table
      className="min-w-full divide-y divide-gray-200 table-auto"
      {...props}
    />
  ),
  thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50" {...props} />
  ),
  tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="bg-white divide-y divide-gray-200" {...props} />
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => <tr {...props} />,
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="px-6 py-4 whitespace-nowrap" {...props} />
  ),
  em: (props: React.HTMLProps<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-bold" {...props} />
  ),
};


export default function MarkdownInstructions() {
  const markdownContent = `
# Markdown Guide

## What is Markdown?
Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. Created by John Gruber in 2004, Markdown is now one of the world's most popular markup languages.

## How to Use Markdown
Here are some of the most common syntax used in Markdown:

### Headers
Use the \`#\` symbol to create headers. The number of \`#\` symbols at the start of the line indicates the header level.

\`\`\`markdown
# This is an H1
## This is an H2
### This is an H3
\`\`\`

### Emphasis
You can make text *italic* or **bold** using asterisks or underscores.

\`\`\`markdown
*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__
\`\`\`

### Lists
Markdown supports both ordered and unordered lists.

#### Unordered List
\`\`\`markdown
- Item 1
- Item 2
- Item 3
\`\`\`

#### Ordered List
\`\`\`markdown
1. Item 1
2. Item 2
3. Item 3
\`\`\`

### Links
You can create links by wrapping the link text in brackets \`[]\` and the URL in parentheses \`()\).

\`\`\`markdown
[Google](https://www.google.com)
\`\`\`

### Images
Similar to links, but with an exclamation mark \`!\` at the beginning.

\`\`\`markdown
![Alt text](https://via.placeholder.com/150)
\`\`\`

### Blockquotes
You can create a blockquote by starting the line with a \`>\`.

\`\`\`markdown
> This is a blockquote.
\`\`\`

### Code
To denote inline code, wrap the text in backticks \`\`. For code blocks, use triple backticks.

\`\`\`markdown
\`This is inline code\`

\`\`\`javascript
console.log("This is a code block");
\`\`\`
  `;

  return (
    <div className="p-6 max-w-lg shadow-md rounded-md  mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">How to Write with Markdown</h1>
      <p className="mb-6 text-center text-gray-600">A quick and easy guide to get you started with Markdown.</p>
      <div className="prose max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
          components={customComponents}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

