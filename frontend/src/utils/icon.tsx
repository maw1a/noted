import { icons, type LucideProps } from "lucide-preact";

type Name = keyof typeof icons;

export const Icon = ({ name, ...props }: LucideProps & { name: Name }) => {
	const LucideIcon = icons[name];
	return <LucideIcon {...props} />;
};
