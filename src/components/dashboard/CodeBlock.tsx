import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "bash", title, className, showLineNumbers = false }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className={cn("relative rounded-lg border border-border bg-muted/50 overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <CopyButton 
          text={code} 
          className="absolute top-2 right-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity z-10"
        />
        <pre className="p-4 overflow-x-auto scrollbar-thin">
          <code className="font-mono text-sm text-foreground">
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="select-none pr-4 text-muted-foreground w-8 text-right">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
