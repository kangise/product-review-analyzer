interface JsonHighlightProps {
  json: string;
}

export function JsonHighlight({ json }: JsonHighlightProps) {
  const highlightJson = (jsonString: string) => {
    if (!jsonString) return '';
    
    return jsonString
      .replace(/(".*?")\s*:/g, '<span class="text-primary">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span class="text-green-600">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-emerald-600">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-green-700">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="text-muted-foreground">$1</span>')
      .replace(/([{}[\],])/g, '<span class="text-muted-foreground">$1</span>');
  };

  return (
    <pre 
      className="whitespace-pre-wrap break-words text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlightJson(json) }}
    />
  );
}
