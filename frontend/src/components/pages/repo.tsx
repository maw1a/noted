import React, { useState } from "react";

import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { toast } from "sonner";

import app from "../../utils/constants/app";

import {
	CreateNewRepo,
	OpenExisitingRepo,
	OpenRepoDirectory,
} from "../../../bindings/noted/editor.js";

import logoIcon from "../../assets/images/logo-icon.svg";
import { Icon } from "../icon";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { NotespaceService } from "../../services/notespace";

type Action = "new" | "clone" | "open";

const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const root = url.searchParams.get("root");

	const notespace = new NotespaceService(root ?? undefined);
	const recents = await notespace.getRecentNotespaces();

	return { recents };
};

const Repo = () => {
	const { recents } = useLoaderData<LoaderData<typeof loader>>();
	const [action, setAction] = useState<Action | null>(null);

	function createAction(type: Action) {
		const handler = {
			new: CreateNewRepo,
			open: OpenExisitingRepo,
			clone: OpenExisitingRepo,
		}[type];

		return async () => {
			try {
				setAction(type);
				const dir = await handler();
				console.log({ dir });
			} catch (err) {
				console.log({ err });
				const message = (err as Error).message || "An unknown error occurred";
				toast.error(message);
			} finally {
				setAction(null);
			}
		};
	}

	const createNew = createAction("new");
	const openExisting = createAction("open");
	const cloneRepo = createAction("clone");
	const openRecent = async (path: string) => {
		try {
			setAction("open");
			const dir = await OpenRepoDirectory(path);
			console.log({ dir });
		} catch (err) {
			console.log({ err });
			const message = (err as Error).message || "An unknown error occurred";
			toast.error(message);
		} finally {
			setAction(null);
		}
	};

	return (
		<main className="flex h-full items-stretch w-full">
			<div
				style={{ "--wails-draggable": "drag" } as React.CSSProperties}
				className="flex-1 bg-neutral-900 text-neutral-200 select-none py-16 px-14 flex flex-col items-center justify-between"
			>
				<div className="flex flex-col gap-4 items-center justify-center">
					<svg className="size-24 text-neutral-200" viewBox="0 0 36 36">
						<use href={`${logoIcon}#logo-icon`} />
					</svg>
					<div className="flex flex-col items-center">
						<h1 className="text-4xl font-bold">{app.title}</h1>
						<p className="text-mini text-neutral-400">Version {app.version}</p>
					</div>
				</div>
				<div className="flex flex-col items-stretch w-full gap-2 font-medium">
					<Button disabled={action !== null} onClick={createNew}>
						{action === "new" ? (
							<div className="flex w-full justify-center">
								<Loader />
							</div>
						) : (
							<>
								<Icon
									name="SquarePlus"
									size={20}
									className="transition-colors"
								/>
								<span>Create New Notespace...</span>
							</>
						)}
					</Button>
					<Button disabled={action !== null} onClick={cloneRepo}>
						{action === "clone" ? (
							<div className="flex w-full justify-center">
								<Loader />
							</div>
						) : (
							<>
								<Icon
									name="FolderGit2"
									size={20}
									className="transition-colors"
								/>
								<span>Clone Git Repository...</span>
							</>
						)}
					</Button>
					<Button disabled={action !== null} onClick={openExisting}>
						{action === "open" ? (
							<div className="flex w-full justify-center">
								<Loader />
							</div>
						) : (
							<>
								<Icon
									name="FolderClosed"
									size={20}
									className="transition-colors"
								/>
								<span>Open Existing Notespace...</span>
							</>
						)}
					</Button>
				</div>
			</div>
			<div className="bg-transparent w-[17.8rem] h-full p-4 space-y-0.5 overflow-y-scroll overflow-x-hidden">
				{recents.length > 0 ? (
					<>
						{recents.map((notespace) => (
							<Button
								key={notespace.path}
								variant="ghost"
								className="w-full"
								title={`Open notespace at ${notespace.path}`}
								onClick={() => openRecent(notespace.path)}
							>
								<div
									key={notespace.path}
									className="w-full flex flex-col justify-start items-start gap-0.5 whitespace-nowrap"
								>
									<div className="text-display text-text">
										{notespace.config.name}
									</div>
									<p className="text-mini text-text-muted flex-1 truncate w-full">
										{notespace.path}
									</p>
								</div>
							</Button>
						))}
					</>
				) : (
					<div className="text-text-muted text-mini flex justify-center items-center w-full h-full text-center">
						No Recent Notespaces
					</div>
				)}
			</div>
		</main>
	);
};

Repo.loader = loader;

export { Repo };
