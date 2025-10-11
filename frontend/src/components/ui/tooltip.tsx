import { h } from "preact";

type InputComponent<T> = (props: T) => h.JSX.Element;
type WithTooltipComponent<T> = (props: T & { title?: string }) => h.JSX.Element;

export const withTooltip = <
	T extends { "tooltip-title"?: string; "tooltip-position"?: "top" | "bottom" },
>(
	Component: InputComponent<T>,
): WithTooltipComponent<T> => {
	return (_props) => {
		const { title, ...props } = _props;
		return <Component {...(props as T)} tooltip-title={title} />;
	};
};
