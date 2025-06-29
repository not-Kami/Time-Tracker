import React from 'react';
import { Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={elements.length} className="list-disc list-inside space-y-1 mb-4 ml-4">
              {currentList}
            </ul>
          );
        } else if (listType === 'ol') {
          elements.push(
            <ol key={elements.length} className="list-decimal list-inside space-y-1 mb-4 ml-4">
              {currentList}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (inTable && tableHeaders.length > 0) {
        elements.push(
          <div key={elements.length} className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      {header.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {renderInlineMarkdown(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    };

    const renderInlineMarkdown = (text: string) => {
      // Bold
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Inline code
      text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
      
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle tables
      if (trimmedLine.includes('|') && trimmedLine.length > 1) {
        const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
        
        if (!inTable) {
          // First row becomes headers
          tableHeaders = cells;
          inTable = true;
        } else if (trimmedLine.match(/^[\s\|:\-]+$/)) {
          // Skip separator row
          return;
        } else {
          // Data row
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Handle headings
      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-bold text-gray-900 dark:text-white mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
            {trimmedLine.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
            {trimmedLine.slice(2)}
          </h1>
        );
        return;
      }

      // Handle quotes
      if (trimmedLine.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
            {renderInlineMarkdown(trimmedLine.slice(2))}
          </blockquote>
        );
        return;
      }

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        flushList();
        const codeLines: string[] = [];
        let i = index + 1;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-900 dark:text-white">
              {codeLines.join('\n')}
            </code>
          </pre>
        );
        // Skip the processed lines
        for (let j = index + 1; j <= i; j++) {
          lines[j] = '';
        }
        return;
      }

      // Handle todo items
      if (trimmedLine.match(/^- \[ \]/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(
          <li key={`${index}-todo`} className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">
              {renderInlineMarkdown(trimmedLine.slice(5))}
            </span>
          </li>
        );
        return;
      }

      if (trimmedLine.match(/^- \[x\]/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(
          <li key={`${index}-todo-done`} className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 line-through">
              {renderInlineMarkdown(trimmedLine.slice(5))}
            </span>
          </li>
        );
        return;
      }

      // Handle bullet lists
      if (trimmedLine.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {renderInlineMarkdown(trimmedLine.slice(2))}
          </li>
        );
        return;
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\d+\. /)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        const match = trimmedLine.match(/^\d+\. (.*)$/);
        if (match) {
          currentList.push(
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {renderInlineMarkdown(match[1])}
            </li>
          );
        }
        return;
      }

      // Handle regular paragraphs
      if (trimmedLine) {
        flushList();
        elements.push(
          <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {renderInlineMarkdown(trimmedLine)}
          </p>
        );
      } else {
        flushList();
      }
    });

    // Flush any remaining lists or tables
    flushList();
    flushTable();

    return elements;
  };

  if (!content.trim()) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 italic ${className}`}>
        No content yet...
      </div>
    );
  }

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}