import { useEffect } from "react";
import { type LoaderFunctionArgs, Outlet, useLoaderData } from "react-router";

import { useStore } from "@/components/store";

import { Loader } from "@/components/ui/loader";
import { Sidebar } from "./sidebar";
import { Textarea } from "./textarea";

import { getServices } from "@/services";
import { getCommandFromEvent } from "@/command";

import logoIcon from "@/assets/images/logo-icon.svg";

const EditorContent = () => {
  const loaderData = useLoaderData<LoaderData<typeof EditorContent.loader>>();
  const { state, setState, services } = useStore();

  useEffect(() => {
    setState({
      config: loaderData.notespace.config,
      root: loaderData.notespace.path,
      notespaces: loaderData.notespaces,
      rootNode: loaderData.rootNode,
    });
  }, [loaderData]);

  // Key Binding useEffect
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const command = getCommandFromEvent(e);

      if (command) {
        e.preventDefault();
        command.handler({ state, setState, services });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [state, setState]);

  return (
    <div className="flex-1 w-full max-h-full flex gap-4 p-0">
      <Sidebar />
      <Textarea />
    </div>
  );
};

const Editor = () => {
  return (
    <div className="flex flex-col h-full items-stretch w-full select-none">
      <Outlet />
    </div>
  );
};

EditorContent.loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const root = url.searchParams.get("root");

  if (!root) throw new Error("Failed to open editor. No notespace selected.");

  const services = getServices(root);

  const [{ config, path }, notespaces, rootNode] = await Promise.all([
    services.notespace.getCurrentNotespace(),
    services.notespace.getRecentNotespaces(),
    services.files?.getFileTree(),
  ]);

  return {
    notespaces,
    rootNode,
    notespace: { config, path },
  };
};

EditorContent.Fallback = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="bg-dark-tint text-text rounded-2xl p-8 shadow-dark shadow-lg w-md">
      <div className="flex flex-col justify-center items-center gap-4">
        <svg className="size-12 text-neutral-200" viewBox="0 0 36 36">
          <use href={`${logoIcon}#logo-icon`} />
        </svg>
        <div className="flex flex-col items-center gap-1">
          <p className="text-text text-display text-center">
            Setting up your notespace
          </p>
          <p className="text-text-muted text-mini text-center">
            Opening Your Notespace, This may take few seconds
          </p>
        </div>
        <Loader />
      </div>
    </div>
  </div>
);

export { Editor, EditorContent };
