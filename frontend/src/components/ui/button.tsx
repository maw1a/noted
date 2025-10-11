import { ButtonHTMLAttributes, ComponentChildren, h } from "preact";
import { cn } from "../../utils/cn";
import { Icon, IconName } from "../../utils/icon";

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

export const IconButton = ({
	class: classString,
	className,
	variant = "default",
	...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
	variant?: "default" | "ghost";
} & ({ icon: IconName } | { children: ComponentChildren })) => {
	return (
		<button
			class={cn(
				"p-2 text-display rounded-lg transition-colors",
				{
					default: "bg-transparent hover:bg-surface",
					ghost: "bg-transparent hover:bg-dark-tint",
				}[variant],
				classString,
				className,
			)}
			{...props}
		>
			{"children" in props ? (
				props.children
			) : (
				<Icon
					name={props.icon}
					size={16}
					stroke-width={2}
					class="transition-colors"
				/>
			)}
		</button>
	);
};
