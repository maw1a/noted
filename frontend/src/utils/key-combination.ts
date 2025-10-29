import React from "react";
import { keySymbolMap } from "./constants/key-symbol-map";

export function getKeyCombination(e: KeyboardEvent | React.KeyboardEvent) {
  let keys: Array<string> = [];

  if (e.altKey) keys.push("Alt");
  if (e.ctrlKey) keys.push("Control");
  if (e.metaKey) keys.push("Meta");
  if (e.shiftKey) keys.push("Shift");
  if (e.key && e.key.length > 0) {
    if (e.key in keySymbolMap) keys.push(e.key);
    else keys.push(e.key.charAt(0).toUpperCase() + e.key.slice(1));
  }

  const keyCombination = keys.toSorted().join();

  return { keys, keyCombination };
}
