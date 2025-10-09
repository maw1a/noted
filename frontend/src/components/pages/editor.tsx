import { h } from "preact";
import { Button } from "../ui/button";
import { Icon } from "../../utils/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const Editor = () => {
	return (
		<div class="flex flex-col h-full items-stretch w-full">
			<div class="flex-1 w-full flex gap-4 px-4 pb-4">
				<main class="text-neutral-200 select-none flex-1 flex flex-col items-center justify-between gap-12">
					Editor
				</main>
				<aside class="h-full w-full pt-4 max-w-3xs text-neutral-200">
					<Tabs defaultValue="files" className="w-full h-full">
						<TabsList>
							<TabsTrigger value="files">
								<Icon name="FolderClosed" size={20} />
							</TabsTrigger>
							<TabsTrigger value="extensions">
								<Icon name="Puzzle" size={20} />
							</TabsTrigger>
						</TabsList>
						<TabsContent value="files">
							<div class="bg-neutral-900 h-full rounded-lg">Files</div>
						</TabsContent>
						<TabsContent value="extensions">
							<div class="bg-neutral-900 h-full rounded-lg">Extensions</div>
						</TabsContent>
					</Tabs>
				</aside>
			</div>
		</div>
	);
};
