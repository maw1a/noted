export interface ICommand {
  label: string;
  id: string;
  shortcut: Array<string>;
  isAvailable?: boolean;
  isVisible?: boolean;
}

export class Command<T = unknown> implements ICommand {
  public label: string;
  public id: string;
  public shortcut: Array<string>;
  public isAvailable: boolean = true;
  public isVisible: boolean = true;
  private handler?: (e: Event) => void = undefined;

  constructor({ id, label, shortcut, isAvailable, isVisible }: ICommand) {
    this.id = id;
    this.label = label;
    this.shortcut = shortcut;
    if (typeof isAvailable !== "undefined") this.isAvailable = isAvailable;
    if (typeof isVisible !== "undefined") this.isVisible = isVisible;
  }

  get keyCombination() {
    return this.shortcut.toSorted().join();
  }

  get type() {
    return `command:${this.id}`;
  }

  emit(detail?: T) {
    const event = new CustomEvent(this.type, { detail });
    window.dispatchEvent(event);
    return event;
  }

  subscribe(cb: (e: CustomEvent<T>) => void) {
    this.handler = (e: Event) => cb(e as CustomEvent<T>);
    window.addEventListener(this.type, this.handler);
    return this;
  }

  unsubscribe() {
    if (this.handler) window.removeEventListener(this.type, this.handler);
  }
}
