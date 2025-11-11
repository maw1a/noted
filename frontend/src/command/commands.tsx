import { Command } from "./types";

// * Handled ✔︎
export const editorCommandPalette = new Command({
  id: "editor.command.palette",
  label: "Show All Commands",
  shortcut: ["Meta", "Shift", "P"],
  isVisible: false,
});

// * Handled ✔︎
export const editorSidebarToggle = new Command({
  id: "editor.sidebar.toggle",
  label: "Toggle Sidebar",
  shortcut: ["Meta", "B"],
});

// ! Unhandled ❌
export const editorSettings = new Command({
  id: "editor.settings",
  label: "Open Settings",
  shortcut: ["Meta", ","],
});

// ! Unhandled ❌
export const editorNotespaceFileOpen = new Command({
  id: "editor.notespace.file.open",
  label: "Go to File",
  shortcut: ["Meta", "P"],
});

// ! Unhandled ❌
export const editorNotespaceFind = new Command({
  id: "editor.notespace.find",
  label: "Search in Notespace",
  shortcut: ["Meta", "Shift", "F"],
  // handler: ({ state, setState }) => {
  //   setState(disableWhenDialog(state, { ...state, sidebar_tab: "grep" }));
  // },
});

// ! Unhandled ❌
export const editorNotespaceFileBookmark = new Command({
  id: "editor.notespace.file.bookmark",
  label: "Bookmark Note",
  shortcut: ["Meta", "D"],
  // handler: ({ state, setState }) => {
  //   if (!state.active_tab) return;
  //   const bmrks = new Set([...state.bookmarks]);
  //   if (bmrks.has(state.active_tab.path)) bmrks.delete(state.active_tab.path);
  //   else bmrks.add(state.active_tab.path);
  //   setState(
  //     disableWhenDialog(state, {
  //       ...state,
  //       bookmarks: Array.from(bmrks),
  //     }),
  //   );
  // },
});

// ! Unhandled ❌
export const editorNotespaceFileNew = new Command({
  id: "editor.notespace.file.new",
  label: "Create New File",
  shortcut: ["Meta", "N"],
});

// * Handled ✔︎
export const editorNotespaceFileSave = new Command({
  id: "editor.notespace.file.save",
  label: "Create New File",
  shortcut: ["Meta", "S"],
});
