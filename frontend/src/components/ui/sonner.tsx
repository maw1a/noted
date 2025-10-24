import { Toaster as Sonner, ToasterProps } from "sonner";
import { Icon } from "@/components/icon";
import { Loader } from "./loader";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"dark"}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--color-neutral-900)",
					"--normal-text": "var(--color-neutral-200)",
					"--normal-border": "var(--color-neutral-800)",
				} as React.CSSProperties
			}
			icons={{
				success: <Icon size={16} name="CircleCheckBig" />,
				info: <Icon size={16} name="Info" />,
				warning: <Icon size={16} name="TriangleAlert" />,
				error: <Icon size={16} name="CircleX" />,
				loading: <Loader size={1} />,
			}}
			toastOptions={{
				classNames: {
					toast: "toast",
					title: "title",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
