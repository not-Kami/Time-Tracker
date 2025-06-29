import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Table, Hash, CheckSquare, Quote, Code } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface SlashCommand {
  trigger: string;
  label: string;
  icon: React.ReactNode;
  insert: string;
  description: string;
}

const slashCommands: SlashCommand[] = [
  {
    trigger: '/h1',
    label: 'Heading 1',
    icon: <Hash className="w-4 h-4" />,
    insert: '# ',
    description: 'Large heading'
  },
  {
    trigger: '/h2',
    label: 'Heading 2',
    icon: <Hash className="w-4 h-4" />,
    insert: '## ',
    description: 'Medium heading'
  },
  {
    trigger: '/h3',
    label: 'Heading 3',
    icon: <Hash className="w-4 h-4" />,
    insert: '### ',
    description: 'Small heading'
  },
  {
    trigger: '/todo',
    label: 'Todo List',
    icon: <CheckSquare className="w-4 h-4" />,
    insert: '- [ ] ',
    description: 'Create a todo item'
  },
  {
    trigger: '/list',
    label: 'Bullet List',
    icon: <List className="w-4 h-4" />,
    insert: '- ',
    description: 'Create a bullet list'
  },
  {
    trigger: '/ol',
    label: 'Numbered List',
    icon: <ListOrdered className="w-4 h-4" />,
    insert: '1. ',
    description: 'Create a numbered list'
  },
  {
    trigger: '/table',
    label: 'Table',
    icon: <Table className="w-4 h-4" />,
    insert: '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n',
    description: 'Insert a table'
  },
  {
    trigger: '/quote',
    label: 'Quote',
    icon: <Quote className="w-4 h-4" />,
    insert: '> ',
    description: 'Create a quote block'
  },
  {
    trigger: '/code',
    label: 'Code Block',
    icon: <Code className="w-4 h-4" />,
    insert: '```\n\n```',
    description: 'Insert a code block'
  }
];

export function MarkdownEditor({ value, onChange, placeholder, className = '' }: MarkdownEditorProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);

  const filteredCommands = slashCommands.filter(cmd =>
    cmd.trigger.toLowerCase().includes(commandFilter.toLowerCase()) ||
    cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCommands) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCommand(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCommand(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedCommand]) {
            insertCommand(filteredCommands[selectedCommand]);
          }
          break;
        case 'Escape':
          setShowCommands(false);
          break;
      }
    };

    if (showCommands) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showCommands, selectedCommand, filteredCommands]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check for slash commands
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
    const currentLine = textBeforeCursor.slice(lastLineStart);
    
    if (currentLine.startsWith('/') && currentLine.length > 1) {
      setCommandFilter(currentLine);
      setShowCommands(true);
      setSelectedCommand(0);
    } else {
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
      }
    }

    // Handle Enter key for list continuation
    if (e.key === 'Enter' && !showCommands) {
      const textarea = e.currentTarget;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPos);
      const lastLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
      const currentLine = textBeforeCursor.slice(lastLineStart);

      // Check if current line is a list item
      const bulletMatch = currentLine.match(/^(\s*)(- (?:\[[ x]\] )?)/);
      const numberedMatch = currentLine.match(/^(\s*)(\d+\. )/);

      if (bulletMatch) {
        e.preventDefault();
        const [, indent, prefix] = bulletMatch;
        
        // If the line is empty (just the prefix), remove it
        if (currentLine.trim() === prefix.trim()) {
          const newValue = value.slice(0, lastLineStart) + value.slice(cursorPos);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(lastLineStart, lastLineStart);
          }, 0);
        } else {
          // Continue the list
          let newPrefix = prefix;
          if (prefix.includes('[ ]')) {
            newPrefix = `${indent}- [ ] `;
          } else if (prefix.includes('[x]')) {
            newPrefix = `${indent}- [ ] `;
          } else {
            newPrefix = `${indent}- `;
          }
          
          const newValue = value.slice(0, cursorPos) + '\n' + newPrefix + value.slice(cursorPos);
          onChange(newValue);
          setTimeout(() => {
            const newPos = cursorPos + 1 + newPrefix.length;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
      } else if (numberedMatch) {
        e.preventDefault();
        const [, indent, prefix] = numberedMatch;
        const currentNumber = parseInt(prefix.match(/\d+/)?.[0] || '1');
        
        // If the line is empty (just the prefix), remove it
        if (currentLine.trim() === prefix.trim()) {
          const newValue = value.slice(0, lastLineStart) + value.slice(cursorPos);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(lastLineStart, lastLineStart);
          }, 0);
        } else {
          // Continue the numbered list
          const newPrefix = `${indent}${currentNumber + 1}. `;
          const newValue = value.slice(0, cursorPos) + '\n' + newPrefix + value.slice(cursorPos);
          onChange(newValue);
          setTimeout(() => {
            const newPos = cursorPos + 1 + newPrefix.length;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
      }
    }
  };

  const insertCommand = (command: SlashCommand) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Find the start of the current line to replace the slash command
    const textBeforeStart = value.slice(0, start);
    const lastLineStart = textBeforeStart.lastIndexOf('\n') + 1;
    const currentLine = textBeforeStart.slice(lastLineStart);
    
    if (currentLine.startsWith('/')) {
      // Replace the slash command with the insert text
      const newValue = 
        value.slice(0, lastLineStart) + 
        command.insert + 
        value.slice(end);
      
      onChange(newValue);
      
      // Position cursor after inserted text
      setTimeout(() => {
        let newCursorPos = lastLineStart + command.insert.length;
        
        // For code blocks, position cursor between the backticks
        if (command.trigger === '/code') {
          newCursorPos = lastLineStart + 4; // Position after "```\n"
        }
        
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
    
    setShowCommands(false);
  };

  const insertFormatting = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    const newValue = 
      value.slice(0, start) + 
      before + selectedText + after + 
      value.slice(end);
    
    onChange(newValue);
    
    // Position cursor
    setTimeout(() => {
      if (selectedText) {
        // If text was selected, select the formatted text
        const newStart = start + before.length;
        const newEnd = newStart + selectedText.length;
        textarea.setSelectionRange(newStart, newEnd);
      } else {
        // If no text selected, position cursor between the formatting
        const newPos = start + before.length;
        textarea.setSelectionRange(newPos, newPos);
      }
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('`', '`')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Type <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">/</kbd> for commands
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-0 rounded-b-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono text-sm leading-relaxed ${className}`}
          rows={8}
        />

        {/* Slash Commands Menu */}
        {showCommands && filteredCommands.length > 0 && (
          <div
            ref={commandsRef}
            className="absolute z-10 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-y-auto"
            style={{
              top: '100%',
              left: '1rem'
            }}
          >
            {filteredCommands.map((command, index) => (
              <button
                key={command.trigger}
                type="button"
                onClick={() => insertCommand(command)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  index === selectedCommand ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                  {command.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {command.label}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {command.trigger}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {command.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}