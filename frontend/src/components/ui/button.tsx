import { ButtonHTMLAttributes, ComponentProps, h } from "preact";
import { cn } from "../../utils/cn";

export const Button = ({
	children,
	class: classString,
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			class={cn(
				"rounded-lg flex justify-start items-center gap-2 bg-neutral-800 text-neutral-200 border border-neutral-800 shadow-sm hover:bg-neutral-700 disabled:bg-neutral-700 disabled:text-neutral-400 px-3 h-9 text-sm cursor-pointer disabled:cursor-not-allowed [&_svg]:text-neutral-400 hover:[&_svg]:text-neutral-200 disabled:[&_svg]:text-neutral-400 transition-colors",
				classString,
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
};
