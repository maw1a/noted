import React, { useCallback, useEffect, useMemo } from "react";
import { StoreProvider, useStore } from "../../store";
import { Sidebar } from "./sidebar";
import { Textarea } from "./textarea";
import { NotespaceService } from "../../../services/notespace";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { CommandPalette } from "../../dialogs/command-palette";

const MainContent = () => {
	const [state, setState] = useStore();
	const location = useLocation();

	const setLoading = useCallback(
		(loading: boolean) => setState("loading", loading),
		[setState],
	);

	const notespace = useMemo(() => {
		const searchParams = new URLSearchParams(location.search);
		const root = searchParams.get("root");
		return root ? new NotespaceService(root) : undefined;
	}, [location]);

	async function setupEditor() {
		if (!notespace) return;
		try {
			setLoading(true);
			const { config, path } = await notespace.getCurrentNotespace();
			const notespaces = await notespace.getRecentNotespaces();
			setState({ config, root: path, notespaces });
			toast.success(
				`${config?.name || path.split("/").pop()} notespace ready.`,
			);
		} catch (e) {
			const error = e as Error;
			console.log({ error });
			toast.error("Failed to load notespace.", {
				description: JSON.stringify(error, null, 2),
			});
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		setupEditor();
	}, []);

	return (
		<div className="flex flex-col h-full items-stretch w-full">
			<div className="flex-1 w-full flex gap-4 p-0">
				<Sidebar />
				<Textarea />
			</div>
		</div>
	);
};

export const Editor = () => {
	return (
		<StoreProvider>
			<MainContent />
			<CommandPalette />
		</StoreProvider>
	);
};
