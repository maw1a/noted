import React, { useState } from "react";

import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { toast } from "sonner";

import app from "../../utils/constants/app";

import { CreateNewRepo } from "../../../bindings/noted/editor.js";

import logoIcon from "../../assets/images/logo-icon.svg";
import { Icon } from "../icon";

export const Repo = () => {
	const [action, setAction] = useState<"new" | "clone" | "open" | null>(null);
	const createNew = async () => {
		try {
			setAction("new");
			const dir = await CreateNewRepo();
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
				className="flex-1 bg-neutral-900 text-neutral-200 select-none py-16 px-14 flex flex-col items-center justify-between gap-12"
			>
				<div className="flex flex-col gap-4 items-center justify-center">
					<svg className="size-24 text-neutral-200" viewBox="0 0 36 36">
						<use href={`${logoIcon}#logo-icon`} />
					</svg>
					<div className="flex flex-col items-center">
						<h1 className="text-4xl font-bold">{app.title}</h1>
						<p className="text-sm text-neutral-400">Version {app.version}</p>
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
								<span>Create New Notes Repo...</span>
							</>
						)}
					</Button>
					<Button disabled={action !== null}>
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
					<Button disabled={action !== null}>
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
								<span>Open Existing Repo...</span>
							</>
						)}
					</Button>
				</div>
			</div>
			<div className="bg-transparent w-[17.8rem]"></div>
		</main>
	);
};
