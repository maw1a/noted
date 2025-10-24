import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "../../utils/cn";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { ExactLink } from "../link";

type TreeViewElement = {
	id: string;
	name: string;
	isSelectable?: boolean;
	children?: TreeViewElement[];
};

type TreeContextProps = {
	selectedId: string | undefined;
	expandedItems: string[] | undefined;
	indicator: boolean;
	handleExpand: (id: string) => void;
	selectItem: (id: string) => void;
	setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
	openIcon?: React.ReactNode;
	closeIcon?: React.ReactNode;
	direction: "rtl" | "ltr";
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
	const context = useContext(TreeContext);
	if (!context) {
		throw new Error("useTree must be used within a TreeProvider");
	}
	return context;
};

type Direction = "rtl" | "ltr" | undefined;

type TreeViewProps = {
	initialSelectedId?: string;
	indicator?: boolean;
	elements?: TreeViewElement[];
	initialExpandedItems?: string[];
	openIcon?: React.ReactNode;
	closeIcon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
	(
		{
			className,
			elements,
			initialSelectedId,
			initialExpandedItems,
			children,
			indicator = true,
			openIcon,
			closeIcon,
			dir,
			...props
		},
		ref,
	) => {
		const [selectedId, setSelectedId] = useState<string | undefined>(
			initialSelectedId,
		);
		const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
			initialExpandedItems,
		);

		const selectItem = useCallback((id: string) => {
			setSelectedId(id);
		}, []);

		const handleExpand = useCallback((id: string) => {
			setExpandedItems((prev) => {
				if (prev?.includes(id)) {
					return prev.filter((item) => item !== id);
				}
				return [...(prev ?? []), id];
			});
		}, []);

		const expandSpecificTargetedElements = useCallback(
			(elements?: TreeViewElement[], selectId?: string) => {
				if (!elements || !selectId) return;
				const findParent = (
					currentElement: TreeViewElement,
					currentPath: string[] = [],
				) => {
					const isSelectable = currentElement.isSelectable ?? true;
					const newPath = [...currentPath, currentElement.id];
					if (currentElement.id === selectId) {
						if (isSelectable) {
							setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
						} else {
							if (newPath.includes(currentElement.id)) {
								newPath.pop();
								setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
							}
						}
						return;
					}
					if (
						isSelectable &&
						currentElement.children &&
						currentElement.children.length > 0
					) {
						currentElement.children.forEach((child) => {
							findParent(child, newPath);
						});
					}
				};
				elements.forEach((element) => {
					findParent(element);
				});
			},
			[],
		);

		useEffect(() => {
			if (initialSelectedId) {
				expandSpecificTargetedElements(elements, initialSelectedId);
			}
		}, [initialSelectedId, elements]);

		const direction = dir === "rtl" ? "rtl" : "ltr";

		return (
			<TreeContext.Provider
				value={{
					selectedId,
					expandedItems,
					handleExpand,
					selectItem,
					setExpandedItems,
					indicator,
					openIcon,
					closeIcon,
					direction,
				}}
			>
				<div className={cn("size-full", className)}>
					<ScrollArea
						ref={ref}
						className="relative h-full px-2"
						dir={dir as Direction}
					>
						<AccordionPrimitive.Root
							{...props}
							type="multiple"
							defaultValue={expandedItems}
							value={expandedItems}
							className="flex flex-col gap-1"
							onValueChange={(value) =>
								setExpandedItems((prev) => [...(prev ?? []), value[0]])
							}
							dir={dir as Direction}
						>
							{children}
						</AccordionPrimitive.Root>
					</ScrollArea>
				</div>
			</TreeContext.Provider>
		);
	},
);

Tree.displayName = "Tree";

const TreeIndicator = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { direction } = useTree();

	return (
		<div
			dir={direction}
			ref={ref}
			className={cn(
				"bg-surface-muted absolute left-1.5 h-full w-px rounded-md py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5",
				className,
			)}
			{...props}
		/>
	);
});

TreeIndicator.displayName = "TreeIndicator";

const Triangle = (props: React.ComponentProps<"svg">) => (
	<svg
		width="8"
		height="4"
		viewBox="0 0 8 4"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M6.79289 0C7.23835 0 7.46143 0.538571 7.14645 0.853553L4.35355 3.64645C4.15829 3.84171 3.84171 3.84171 3.64645 3.64645L0.853552 0.853553C0.53857 0.53857 0.761654 0 1.20711 0H6.79289Z"
			fill="currentColor"
		/>
	</svg>
);

type FolderProps = {
	expandedItems?: string[];
	element: React.ReactNode;
	isSelectable?: boolean;
	isSelect?: boolean;
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const Folder = forwardRef<
	HTMLDivElement,
	FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
	(
		{
			className,
			element,
			value,
			isSelectable = true,
			isSelect,
			children,
			...props
		},
		ref,
	) => {
		const {
			direction,
			handleExpand,
			expandedItems,
			indicator,
			setExpandedItems,
		} = useTree();

		return (
			<AccordionPrimitive.Item
				{...props}
				value={value}
				className="relative h-full overflow-hidden"
			>
				<AccordionPrimitive.Trigger
					className={cn(
						`flex items-center rounded-md text-display w-full gap-2`,
						className,
						isSelect && isSelectable
							? "bg-surface-muted text-text rounded-md"
							: "text-text-muted hover:text-text",
						{
							"cursor-pointer": isSelectable,
							"cursor-not-allowed opacity-50": !isSelectable,
						},
					)}
					disabled={!isSelectable}
					onClick={() => handleExpand(value)}
				>
					<div
						className={cn(
							"size-3 flex items-center justify-center transition-transform",
							!expandedItems?.includes(value) && "-rotate-90",
						)}
					>
						<Triangle className="scale-150" />
					</div>
					<div className="py-1 px-1.5 flex items-center justify-start gap-1">
						{element}
					</div>
				</AccordionPrimitive.Trigger>
				<AccordionPrimitive.Content className="relative h-full overflow-hidden text-display">
					{element && indicator && <TreeIndicator aria-hidden="true" />}
					<AccordionPrimitive.Root
						dir={direction}
						type="multiple"
						className="ml-5 flex flex-col rtl:mr-5"
						defaultValue={expandedItems}
						value={expandedItems}
						onValueChange={(value) => {
							setExpandedItems?.((prev) => [...(prev ?? []), value[0]]);
						}}
					>
						{children}
					</AccordionPrimitive.Root>
				</AccordionPrimitive.Content>
			</AccordionPrimitive.Item>
		);
	},
);

Folder.displayName = "Folder";

const File = forwardRef<
	HTMLAnchorElement,
	{
		value: string;
		handleSelect?: (id: string) => void;
		children: React.ReactNode;
	} & Omit<React.ComponentProps<typeof ExactLink>, "children">
>(({ value, className, handleSelect, children, ...props }, ref) => {
	const { direction } = useTree();
	return (
		<ExactLink
			ref={ref}
			className={({ isActive }) =>
				cn(
					"flex w-full items-center text-display py-0.5 pr-1 cursor-pointer",
					direction === "rtl" ? "rtl" : "ltr",
					isActive ? "text-text" : "text-text-muted hover:text-text",
					className,
				)
			}
			onClick={() => {
				handleSelect?.(value);
			}}
			{...props}
		>
			{({ isActive }) => (
				<div
					className={cn(
						"flex w-fit gap-1 items-center justify-start rounded-md px-1.5 py-0.5",
						isActive && "bg-surface-muted",
					)}
				>
					{children}
				</div>
			)}
		</ExactLink>
	);
});

File.displayName = "File";

const CollapseButton = forwardRef<
	HTMLButtonElement,
	{
		elements: TreeViewElement[];
		expandAll?: boolean;
	} & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
	const { expandedItems, setExpandedItems } = useTree();

	const expendAllTree = useCallback((elements: TreeViewElement[]) => {
		const expandTree = (element: TreeViewElement) => {
			const isSelectable = element.isSelectable ?? true;
			if (isSelectable && element.children && element.children.length > 0) {
				setExpandedItems?.((prev) => [...(prev ?? []), element.id]);
				element.children.forEach(expandTree);
			}
		};

		elements.forEach(expandTree);
	}, []);

	const closeAll = useCallback(() => {
		setExpandedItems?.([]);
	}, []);

	useEffect(() => {
		console.log(expandAll);
		if (expandAll) {
			expendAllTree(elements);
		}
	}, [expandAll]);

	return (
		<Button
			variant={"ghost"}
			className="absolute right-2 bottom-1 h-8 w-fit p-1"
			onClick={
				expandedItems && expandedItems.length > 0
					? closeAll
					: () => expendAllTree(elements)
			}
			ref={ref}
			{...props}
		>
			{children}
			<span className="sr-only">Toggle</span>
		</Button>
	);
});

CollapseButton.displayName = "CollapseButton";

export { CollapseButton, File, Folder, Tree, type TreeViewElement };
