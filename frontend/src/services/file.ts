import { Editor } from "@go/noted/pkg/editor";
import { Scanner } from "@go/noted/pkg/file";

import * as prettier from "prettier";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import markdown from "prettier/plugins/markdown";
import postcss from "prettier/plugins/postcss";

export type Language = "markdown" | "json" | "css";
export type FileInfo = {
  filename: string;
  parent: string | null;
  rel: string;
  path: string;
  ext: string | undefined;
  filetype: Language | string;
};

const prettierConfig: prettier.Options = {
  useTabs: false,
  endOfLine: "lf",
  plugins: [babel, estree, markdown, postcss],
};

export class FileService {
  constructor(private readonly root: string) {}

  public async getFileTree() {
    const rootNode = await Scanner.GetFileTree(this.root);
    return rootNode;
  }

  public async getFileContent(path: string) {
    const content = await Scanner.GetFileData(path);
    return content;
  }

  public async saveFileContent(path: string, content: string) {
    await Scanner.SaveFileData(path, content);
  }

  format(path: string, content: string): Promise<{ content: string }>;
  format(
    path: string,
    content: string,
    caret: number,
  ): Promise<{ content: string; caret: number }>;
  format(
    path: string,
    content: string,
    caret: [number, number],
  ): Promise<{ content: string; caret: [number, number] }>;
  public async format(
    path: string,
    content: string,
    caret?: number | [number, number],
  ) {
    const { filetype } = FileService.getFileInfo(this.root, path);
    if (typeof caret !== "undefined") {
      function formatWithCursor(cursorOffset: number) {
        return prettier.formatWithCursor(content, {
          cursorOffset: cursorOffset,
          filepath: path,
          parser: filetype,
          ...prettierConfig,
        });
      }

      if (Array.isArray(caret)) {
        const [start, end] = await Promise.all(caret.map(formatWithCursor));
        return {
          content: start.formatted,
          caret: [start.cursorOffset, end.cursorOffset],
        };
      }

      const formatted = await formatWithCursor(caret);
      return { caret: formatted.cursorOffset, content: formatted.formatted };
    }

    const formatted = await prettier.format(content, {
      filepath: path,
      parser: filetype,
      ...prettierConfig,
    });
    return { content: formatted };
  }

  static async openRepoDirectory(root: string) {
    const dir = await Editor.OpenRepoDirectory(root);
    return dir;
  }

  static getFileInfo(root: string, path: string, ext?: string): FileInfo {
    let parts = path.split("/");

    const abs = parts.pop()!;
    ext = ext ?? abs.split(".").pop();

    let rel = parts.join("/");
    rel = rel.replace(root, "");

    const parent = rel === "" ? null : parts.pop() || null;

    if (ext === "md") {
      const filename = abs.split(".").slice(0, -1).join(".");
      return { filename, rel, parent, path, ext, filetype: "markdown" };
    }
    return { filename: abs, rel, parent, path, ext, filetype: ext! };
  }
}
