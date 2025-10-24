import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { NotespaceService } from "@/services/notespace";
import { OpenRepoDirectory } from "@go/noted/editor";
import { useRepoContext } from "./context";

const Recents = () => {
	const { recents } = useLoaderData<LoaderData<typeof Recents.loader>>();

	const [_, setAction] = useRepoContext();

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
		<>
			{recents.length > 0 ? (
				recents.map((notespace) => (
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
				))
			) : (
				<div className="text-text-muted text-mini flex justify-center items-center w-full h-full text-center">
					No Recent Notespaces
				</div>
			)}
		</>
	);
};

Recents.loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const root = url.searchParams.get("root");
	const notespace = new NotespaceService(root ?? undefined);
	const recents = await notespace.getRecentNotespaces();

	return { recents };
};

Recents.Fallback = () => (
	<div className="text-text-muted text-mini flex justify-center items-center w-full h-full text-center">
		<Loader />
	</div>
);

export { Recents };
