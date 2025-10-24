import React from "react";

type InputComponent<T> = (props: T) => React.ReactElement;
type WithTooltipComponent<T> = (
	props: T & { title?: string },
) => React.ReactElement;

export const withTooltip = <
	T extends { "tooltip-title"?: string; "tooltip-position"?: "top" | "bottom" },
>(
	Component: InputComponent<T>,
): WithTooltipComponent<T> => {
	return (_props) => {
		const {
			"tooltip-title": tooltipTitle,
			"tooltip-position": tooltipPosition,
			...props
		} = _props;

		// For now, just render the component without tooltip functionality
		// You can integrate with a tooltip library like Radix UI Tooltip later
		return <Component {...(props as T)} />;
	};
};
