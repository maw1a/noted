import React from "react";
import { cn } from "../../utils/cn";

export const Loader = ({ size = 3 }: { size?: 1 | 2 | 3 }) => (
	<div
		className={cn("flex items-center", ["gap-1", "gap-1.5", "gap-2"][size - 1])}
	>
		<span
			className={cn(
				"rounded-full bg-neutral-200 [animation:loader-dots_1000ms_ease-out_infinite] will-change-transform",
				["size-1", "size-2", "size-3"][size - 1],
			)}
		/>
		<span
			className={cn(
				"rounded-full bg-neutral-200 delay-150 [animation:loader-dots_1000ms_ease-out_infinite] will-change-transform",
				["size-1", "size-2", "size-3"][size - 1],
			)}
		/>
		<span
			className={cn(
				"rounded-full bg-neutral-200 delay-300 [animation:loader-dots_1000ms_ease-out_infinite] will-change-transform",
				["size-1", "size-2", "size-3"][size - 1],
			)}
		/>
	</div>
);
