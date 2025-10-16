import type { IconName } from "../../components/icon";

export const keySymbolMap = {
	Alt: "Option" as IconName,
	Control: "ChevronUp" as IconName,
	Meta: "Command" as IconName,
	Shift: "ArrowBigUp" as IconName,
	Delete: "Delete" as IconName,
	Enter: "CornerDownLeft" as IconName,
	Escape: "CircleArrowOutUpLeft" as IconName,
	" ": "Space" as IconName,
	ArrowUp: "ArrowUp" as IconName,
	ArrowDown: "ArrowDown" as IconName,
	ArrowLeft: "ArrowLeft" as IconName,
	ArrowRight: "ArrowRight" as IconName,
	Tab: "ArrowRightToLine" as IconName,
	PageDown: (
		<div className="flex flex-col text-[6px] leading-[7px] h-3.5">
			<div>PG</div>
			<div>DN</div>
		</div>
	),
	PageUp: (
		<div className="flex flex-col text-[6px] leading-[7px] h-3.5">
			<div>PG</div>
			<div>UP</div>
		</div>
	),
};

export type Keys = keyof typeof keySymbolMap;
