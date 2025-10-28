import { GetFileTree, GetFileData, SaveFileData } from "@go/noted/scanner";
import * as prettier from "prettier";

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
  useTabs: true,
  endOfLine: "lf",
};

export class FileService {
  constructor(private readonly root: string) {}

  public async getFileTree() {
    const rootNode = await GetFileTree(this.root);
    return rootNode;
  }

  public async getFileContent(path: string) {
    const content = await GetFileData(path);
    return content;
  }

  public async saveFileContent(path: string, content: string) {
    await SaveFileData(path, content);
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

  static async formatFileContent(
    {
      value,
      caret,
    }: {
      value: string;
      caret?: number;
    },
    language: Language | string,
  ) {
    const { cursorOffset, formatted } = await prettier.formatWithCursor(value, {
      cursorOffset: caret || 0,
      ...(language.includes(".")
        ? { parser: language }
        : { filepath: language }),
      ...prettierConfig,
    });
    return { value: formatted, caret: cursorOffset };
  }
}
