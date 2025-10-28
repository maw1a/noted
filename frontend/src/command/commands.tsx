import { KeyIcon } from "@/components/icon";
import { StoreContextType } from "@/components/store/types";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { disableWhenDialog } from "./helpers";
import { ICommand } from "./types";

class Command implements ICommand {
  public label: string;
  public id: string;
  public shortcut: Array<string>;
  public handler: <T>(args: StoreContextType & T) => void;
  public isAvailable: boolean = true;
  public isVisible: boolean = true;

  constructor({
    id,
    label,
    shortcut,
    handler,
    isAvailable,
    isVisible,
  }: ICommand) {
    this.id = id;
    this.label = label;
    this.shortcut = shortcut;
    this.handler = handler;
    if (typeof isAvailable !== "undefined") this.isAvailable = isAvailable;
    if (typeof isVisible !== "undefined") this.isVisible = isVisible;
  }

  get keyCombination() {
    return this.shortcut.toSorted().join();
  }

  Node(className?: string) {
    return (
      <KbdGroup className={className}>
        <p className="mr-2 text-end w-44">{this.label}</p>
        {this.shortcut.map((key) => (
          <Kbd key={key} className="[&_svg]:size-3 [&_span]:text-mini">
            <KeyIcon name={key} />
          </Kbd>
        ))}
      </KbdGroup>
    );
  }
}

export const editorCommandPalette = new Command({
  id: "editor.command.palette",
  label: "Show All Commands",
  shortcut: ["Meta", "Shift", "P"],
  handler: ({ state, setState }) => {
    setState({
      ...state,
      dialog: state.dialog === "cmd-palette" ? null : "cmd-palette",
    });
  },
  isVisible: false,
});

export const editorSidebarToggle = new Command({
  id: "editor.sidebar.toggle",
  label: "Toggle Sidebar",
  shortcut: ["Meta", "B"],
  handler: ({ state, setState }) => {
    setState(disableWhenDialog(state, { ...state, sidebar: !state.sidebar }));
  },
});

export const editorSettings = new Command({
  id: "editor.settings",
  label: "Open Settings",
  shortcut: ["Meta", ","],
  handler: ({ state, setState }) => {
    setState(disableWhenDialog(state, { ...state }));
  },
});

export const editorNotespaceFileOpen = new Command({
  id: "editor.notespace.file.open",
  label: "Go to File",
  shortcut: ["Meta", "P"],
  handler: () => {},
});

export const editorNotespaceFind = new Command({
  id: "editor.notespace.find",
  label: "Search in Notespace",
  shortcut: ["Meta", "Shift", "F"],
  handler: ({ state, setState }) => {
    setState(disableWhenDialog(state, { ...state, sidebar_tab: "grep" }));
  },
});

export const editorNotespaceFileBookmark = new Command({
  id: "editor.notespace.file.bookmark",
  label: "Bookmark Note",
  shortcut: ["Meta", "D"],
  handler: ({ state, setState }) => {
    if (!state.active_tab) return state;
    const bmrks = new Set([...state.bookmarks]);
    if (bmrks.has(state.active_tab.path)) bmrks.delete(state.active_tab.path);
    else bmrks.add(state.active_tab.path);
    setState(
      disableWhenDialog(state, {
        ...state,
        bookmarks: Array.from(bmrks),
      }),
    );
  },
});

export const editorNotespaceFileNew = new Command({
  id: "editor.notespace.file.new",
  label: "Create New File",
  shortcut: ["Meta", "N"],
  handler: () => {},
});

export const editorNotespaceFileSave = new Command({
  id: "editor.notespace.file.save",
  label: "Create New File",
  shortcut: ["Meta", "S"],
  handler: ({ state }) => {
    if (!state.active_tab) return;
    console.log("opened:", state.active_tab.path);
  },
});
