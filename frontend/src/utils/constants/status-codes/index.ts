import { toast } from "sonner";
import messages from "./messages.json";

type Level = "INFO" | "FAILED" | "WARN" | "SUCCESS" | "INVALID";

export const status = (
	code: string,
): {
	message: string | null;
	level: Level;
} => {
	if (code in messages)
		return {
			message: messages[code as keyof typeof messages],
			level: code.split("_")[0] as Level,
		};

	return { message: null, level: "INVALID" };
};

export const toastify = (code: string) => {
	const { level, message } = status(code);
	if (!message) return;
	switch (level) {
		case "INFO":
			toast.info(message);
			break;
		case "FAILED":
			toast.error(message);
			break;
		case "WARN":
			toast.warning(message);
			break;
		case "SUCCESS":
			toast.success(message);
			break;
		case "INVALID":
			toast.error("An unknown error occurred");
			break;
	}
};
