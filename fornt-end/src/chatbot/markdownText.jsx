import React from "react";

function MarkdownText({ text }) {
  const formatText = (str) => {
    // Bold: **text** or __text__
    str = str.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-indigo-600">$1</strong>');
    str = str.replace(/__(.+?)__/g, '<strong class="font-bold text-indigo-600">$1</strong>');
    
    // Italic: *text* or _text_
    str = str.replace(/\*(.+?)\*/g, '<em class="italic text-indigo-500">$1</em>');
    str = str.replace(/_(.+?)_/g, '<em class="italic text-indigo-500">$1</em>');
    
    // Inline code: `code`
    str = str.replace(/`(.+?)`/g, '<code class="px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md text-xs font-mono shadow-sm">$1</code>');
    
    // Links: [text](url)
    str = str.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-2 hover:decoration-indigo-600 transition-all duration-200 font-medium">$1</a>');
    
    return str;
  };

  const parseContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let listItems = [];
    let inCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, idx) => {
      // Code blocks: ```
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4 rounded-xl text-sm font-mono overflow-x-auto my-3 shadow-lg border border-gray-700">
              <code className="text-green-400">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Flush list items if we're no longer in a list
      if (!line.trim().match(/^[-*•]\s/) && listItems.length > 0) {
        elements.push(
          <ul key={`list-${idx}`} className="space-y-2 my-3 pl-2">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-200">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mt-0.5 shadow-md">
                  <span className="text-white text-xs font-bold">✓</span>
                </span>
                <span className="flex-1 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }

      // List items: - or * or •
      if (line.trim().match(/^[-*•]\s/)) {
        const item = line.trim().replace(/^[-*•]\s/, '');
        listItems.push(item);
        return;
      }

      // Numbered list: 1. 2. etc
      if (line.trim().match(/^\d+\.\s/)) {
        const item = line.trim().replace(/^\d+\.\s/, '');
        const num = line.match(/^\d+/)[0];
        elements.push(
          <div key={`num-${idx}`} className="flex items-start gap-3 my-2 group hover:translate-x-1 transition-transform duration-200">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
              {num}
            </span>
            <span className="flex-1 text-gray-700 leading-relaxed pt-0.5" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
          </div>
        );
        return;
      }

      // Headings: ### or ## or #
      if (line.trim().startsWith('###')) {
        elements.push(
          <h4 key={idx} className="font-bold text-base mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {line.replace(/^###\s/, '')}
          </h4>
        );
        return;
      }
      if (line.trim().startsWith('##')) {
        elements.push(
          <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {line.replace(/^##\s/, '')}
          </h3>
        );
        return;
      }
      if (line.trim().startsWith('#')) {
        elements.push(
          <h2 key={idx} className="font-bold text-xl mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {line.replace(/^#\s/, '')}
          </h2>
        );
        return;
      }

      // Blockquote: >
      if (line.trim().startsWith('>')) {
        elements.push(
          <blockquote key={idx} className="border-l-4 border-gradient-to-b from-indigo-500 to-purple-600 bg-gradient-to-r from-indigo-50 to-purple-50 pl-4 pr-3 py-2 italic text-gray-700 my-3 rounded-r-lg shadow-sm">
            {line.replace(/^>\s/, '')}
          </blockquote>
        );
        return;
      }

      // Horizontal rule: --- or ***
      if (line.trim().match(/^(---|\*\*\*)$/)) {
        elements.push(
          <hr key={idx} className="my-4 border-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
        );
        return;
      }

      // Regular paragraph
      if (line.trim()) {
        elements.push(
          <p key={idx} className="my-2 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(line) }} />
        );
      } else {
        elements.push(<br key={idx} />);
      }
    });

    // Flush remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="space-y-2 my-3 pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-200">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-xs font-bold">✓</span>
              </span>
              <span className="flex-1 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
            </li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return <div className="markdown-content">{parseContent(text)}</div>;
}

export default MarkdownText;