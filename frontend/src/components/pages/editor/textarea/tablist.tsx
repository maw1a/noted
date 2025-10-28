import { useMemo } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Icon } from "@/components/icon";
import { useStore } from "@/components/store";
import { FileService, type FileInfo } from "@/services";

const Tab = ({
  idx,
  info,
  root,
  duplicate,
}: {
  idx: number;
  info: FileInfo;
  root: string;
  duplicate?: boolean;
}) => {
  const {
    state: { active_tab, tabs },
    setState,
  } = useStore();

  const { isActive, isDirty, ...newState } = useMemo(() => {
    const isActive = active_tab?.path === info.path;
    const newTabs = tabs.toSpliced(idx, 1);
    const newActiveTab: string | null =
      newTabs.length > 0
        ? idx <= newTabs.length - 1
          ? newTabs[idx]
          : newTabs[newTabs.length - 1]
        : null;
    return {
      isActive,
      isDirty: active_tab?.content !== active_tab?.defaultContent,
      tabs: newTabs,
      active_tab: isActive ? newActiveTab : (active_tab?.path ?? null),
    };
  }, [idx, active_tab, tabs, info.path]);

  return (
    <div className="relative hover:[&_a.close]:block">
      <NavLink
        to={{ pathname: `/editor`, search: `?root=${root}&file=${info.path}` }}
        prefetch="intent"
        className={({ isActive, isPending }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "px-3 py-1.5 flex gap-0.5 items-center justify-center text-display text-text-muted",
            isActive && "bg-dark-tint",
            isPending && "[&_span]:text-transparent [&_.loader]:visible",
          )
        }
      >
        <Loader className="loader invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
        {duplicate ? (
          <>
            <span>{info.parent}</span> <span>/</span>
          </>
        ) : null}
        <span className="text-text">{info.filename}</span>
        <span
          className={cn(
            "size-1 rounded-full bg-text-muted ml-0.5",
            isDirty ? "block" : "hidden",
          )}
        />
      </NavLink>
      <Link
        to={{
          pathname: "/editor",
          search: `?root=${root}${newState.active_tab ? `&file=${newState.active_tab}}` : ""}`,
        }}
        className="close absolute top-1/2 -translate-y-1/2 right-1.5 p-0.5 hidden cursor-pointer rounded bg-dark hover:bg-surface-muted [&_svg]:text-text-muted hover:[&_svg]:text-text [&_span]:bg-text-muted hover:[&_span]:bg-text"
        onClick={() => {
          setState("tabs", newState.tabs);
        }}
      >
        {isDirty ? (
          <div className="size-3.5 flex items-center justify-center">
            <span className="size-1 rounded-full transition-colors" />
          </div>
        ) : (
          <Icon name="X" size={14} className="transition-colors" />
        )}
      </Link>
    </div>
  );
};

export const Tablist = ({
  tabs,
  root,
}: {
  tabs: Array<string>;
  root: string;
}) => {
  const infos = useMemo(
    () => tabs.map((tab) => FileService.getFileInfo(root, tab)),
    [root, tabs],
  );

  const duplicates = useMemo(
    () =>
      infos.reduce(
        ({ duplicates, exists }, cur) => ({
          duplicates: exists[cur.filename]
            ? { ...duplicates, [cur.filename]: true }
            : duplicates,
          exists: { ...exists, [cur.filename]: true },
        }),
        {
          duplicates: {},
          exists: {},
        } as {
          duplicates: Record<string, boolean>;
          exists: Record<string, boolean>;
        },
      ).duplicates,
    [infos],
  );

  return (
    <div className="w-full flex items-center gap-2">
      {infos.map((fileinfo, idx) => (
        <Tab
          key={fileinfo.path}
          idx={idx}
          duplicate={duplicates[fileinfo.filename]}
          root={root}
          info={fileinfo}
        />
      ))}
    </div>
  );
};
