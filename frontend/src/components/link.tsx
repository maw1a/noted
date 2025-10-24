import { ComponentProps, useMemo } from "react";
import { NavLink, Path, useLocation } from "react-router";

type ExactLinkProps = Omit<ComponentProps<typeof NavLink>, "to"> & {
	to: Partial<Path>;
};

function compare<T>(a: T, b: T, defaultValue: boolean = true) {
	const value = defaultValue;
	return {
		value,
		match: (key: keyof T) => {
			const nv = value && a[key] === b[key];
			return compare(a, b, nv);
		},
	};
}

export const ExactLink = ({
	to,
	children,
	className,
	style,
	...props
}: ExactLinkProps) => {
	const loc = useLocation();

	const active = useMemo(() => {
		const comp = compare<Partial<Path>>(to, {
			pathname: loc.pathname,
			hash: loc.hash,
			search: loc.search,
		});
		const isActive = comp.match("pathname").match("search").value;
		return isActive;
	}, [loc, to]);

	return (
		<NavLink
			{...props}
			to={to}
			className={
				typeof className === "function"
					? ({ isPending, isTransitioning }) =>
							className({ isActive: active, isPending, isTransitioning })
					: className
			}
			style={
				typeof style === "function"
					? ({ isPending, isTransitioning }) =>
							style({ isActive: active, isPending, isTransitioning })
					: style
			}
		>
			{typeof children === "function"
				? ({ isPending, isTransitioning }) =>
						children({ isActive: active, isPending, isTransitioning })
				: children}
		</NavLink>
	);
};
