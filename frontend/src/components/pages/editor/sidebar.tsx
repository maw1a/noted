import { useCallback } from "react";
import { useStore } from "@/components/store";
import { IconButton } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { TabList } from "./tablist";

export const Sidebar = () => {
  const { state, setState } = useStore();

  const toggleSidebar = useCallback(() => {
    setState("sidebar", !state.sidebar);
  }, [state.sidebar, setState]);

  return (
    <aside
      className={cn(
        "absolute left-0 top-0 bottom-0 flex flex-col h-full w-2xs py-4 text-text bg-dark-tint backdrop-blur-xs text-display gap-y-4 shadow-dark shadow-xl transition-transform duration-300",
        !state.sidebar && "-translate-x-80",
      )}
    >
      <div className="flex w-full justify-end px-4">
        <IconButton
          tooltip-title="Close Sidebar"
          tooltip-position="bottom"
          icon="PanelLeft"
          className="text-text"
          onClick={toggleSidebar}
        />
      </div>
      <TabList defaultValue="files" />
    </aside>
  );
};
