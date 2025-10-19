import { Outlet } from "react-router";
import { StoreProvider } from "../store";

const Root = () => (
	<StoreProvider>
		<Outlet />
	</StoreProvider>
);

export { Root };
