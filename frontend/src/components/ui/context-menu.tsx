import { cn } from "@/utils/cn";
import * as Portal from "@radix-ui/react-portal";
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MenubarShortcut } from "./menubar";

interface ContextMenuState {
  id: string;
  x: number;
  y: number;
}

type ContextMenuProps = ComponentProps<"div"> & {
  value: ContextMenuState | undefined;
  onClose: () => void;
};

function ContextMenu({
  value,
  onClose,
  children,
  className,
  style,
  ...props
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null!);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | undefined>(
    value,
  );

  const handleClose = useCallback(() => {
    setContextMenu(undefined);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu, handleClose]);

  useEffect(() => setContextMenu(value), [value]);

  if (!contextMenu) return null;

  return (
    <Portal.Root>
      <div
        ref={menuRef}
        {...props}
        role="menu"
        className={cn(
          "fixed z-50 min-w-[12rem] bg-dark-tint backdrop-blur-xs text-text rounded-lg shadow-md p-1 animate-in fade-in-0 zoom-in-95",
          className,
        )}
        style={{
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
          ...style,
        }}
      >
        {children}
      </div>
    </Portal.Root>
  );
}

function ContextMenuItem({
  className,
  inset,
  ...props
}: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      role="menuitem"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-display outline-none focus:bg-surface-muted focus:text-text hover:bg-surface-muted hover:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

const ContextMenuShortcut = MenubarShortcut;

export { ContextMenu, ContextMenuItem, ContextMenuShortcut };
