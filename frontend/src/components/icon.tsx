import { icons, type LucideProps } from "lucide-react";
import { Keys, keySymbolMap } from "../utils/constants/key-symbol-map";

export type IconName = keyof typeof icons;

export const Icon = ({ name, ...props }: LucideProps & { name: IconName }) => {
	const LucideIcon = icons[name];
	return <LucideIcon {...props} />;
};

export const KeyIcon = ({ name }: { name: Keys | string }) => {
	if (!(name in keySymbolMap)) {
		return (
			<span
				className="text-display capitalize leading-3.5"
				style={{ width: `${name.trim().length}ch` }}
			>
				{name.trim()}
			</span>
		);
	}
	if (typeof keySymbolMap[name as Keys] === "string")
		return <Icon name={keySymbolMap[name as Keys] as IconName} size={14} />;
	return keySymbolMap[name as Keys];
};
