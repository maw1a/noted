import { FileService } from "./file";
import { NotespaceService } from "./notespace";

export * from "./file";
export * from "./notespace";

export function getServices(root: string | undefined) {
  const notespace = new NotespaceService(root);
  if (typeof root === "undefined") return { notespace };
  return {
    notespace,
    files: new FileService(root),
  };
}
