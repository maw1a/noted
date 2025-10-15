import { icons, type LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

export const Icon = ({ name, ...props }: LucideProps & { name: IconName }) => {
	const LucideIcon = icons[name];
	return <LucideIcon {...props} />;
};
