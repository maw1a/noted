import React, { useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import type { Root, RootContent } from "hast";
import { type FileInfo, FileService } from "@/services/file";

function getCaretLineIndex(value: string, caret: number): number {
  // Clamp caret in range
  const pos = Math.max(0, Math.min(caret, value.length));
  // Count number of newline characters before caret
  let line = 0;
  for (let i = 0; i < pos; i++) {
    const ch = value.charCodeAt(i);
    // treat '\n' as a line break; '\r' will be followed by '\n' typically
    if (ch === 10 /* \n */) line++;
  }
  return line;
}

export type Language = "markdown" | "json" | "css";

export interface EditorProps {
  defaultValue?: string;
  value: string;
  info: FileInfo;
  placeholder?: string;
  onChange?: (value: string) => void;
  padding?: number;
  minHeight?: number;
  style?: React.CSSProperties;
  colorMode?: "dark" | "light";
}

export const Editor: React.FC<EditorProps> = ({
  defaultValue,
  value,
  info,
  placeholder = "Start typing…",
  onChange: _onChange,
  padding = 16,
  minHeight = 160,
  style,
  colorMode,
}) => {
  const [caretLine, setCaretLine] = React.useState(0);
  const language = info.filetype as Language;

  // We need to read selectionStart from the underlying textarea.
  // CodeEditor forwards onKeyUp/onClick/onChange, so we can update caretLine there.
  const handleAnyTextEvent = (
    ev: React.SyntheticEvent<HTMLTextAreaElement>,
  ) => {
    const ta = ev.currentTarget;
    const lineIndex = getCaretLineIndex(ta.value, ta.selectionStart || 0);
    setCaretLine(lineIndex);
  };

  // Also update on input changes
  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    _onChange?.(ev.target.value);
    const lineIndex = getCaretLineIndex(
      ev.target.value,
      ev.target.selectionStart || 0,
    );
    setCaretLine(lineIndex);
  };

  return (
    <div data-color-mode={colorMode} className="text-editor-wrapper">
      <CodeEditor
        language={language}
        placeholder={placeholder}
        padding={padding}
        minHeight={minHeight}
        style={style}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        onKeyUp={handleAnyTextEvent}
        onClick={handleAnyTextEvent}
        onKeyDown={handleAnyTextEvent}
        rehypePlugins={[
          [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
          [
            rehypeRewrite,
            {
              rewrite: (node: Root | RootContent, index: number) => {
                if (node.type === "element") {
                  const className = node.properties?.className as
                    | string[]
                    | undefined;
                  if (className?.includes("code-line")) {
                    if (typeof caretLine === "number" && index === caretLine) {
                      const cls = node.properties.className as string[];
                      if (!cls.includes("bg-dark-tint")) {
                        cls.push("bg-dark-tint");
                      }
                    } else {
                      const cls = node.properties.className as string[];
                      node.properties.className = cls.filter(
                        (c: string) => c !== "bg-neutral-200",
                      );
                    }
                  }
                }
              },
            },
          ],
        ]}
      />
    </div>
  );
};
