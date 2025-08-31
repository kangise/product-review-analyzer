interface JsonHighlightProps {
  json: string;
}

export function JsonHighlight({ json }: JsonHighlightProps) {
  const highlightJson = (jsonString: string) => {
    if (!jsonString) return '';
    
    return jsonString
      .replace(/(".*?")\s*:/g, '<span class="text-blue-500">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span class="text-green-500">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-orange-500">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-purple-500">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="text-gray-500">$1</span>')
      .replace(/([{}[\],])/g, '<span class="text-gray-600">$1</span>');
  };

  return (
    <pre 
      className="whitespace-pre-wrap break-words text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlightJson(json) }}
    />
  );
}