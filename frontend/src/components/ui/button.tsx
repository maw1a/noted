import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Icon, IconName } from "@/components/icon";

export const buttonVariants = cva(
  "p-2 text-display rounded-lg transition-colors flex items-center gap-2 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-surface hover:bg-surface-muted",
        ghost: "bg-transparent hover:bg-dark-tint hover:backdrop-blur-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "ghost";
  }
>(({ children, className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), "px-3", className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    variant?: "default" | "ghost";
  } & ({ icon: IconName } | { children: ReactNode })
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {"children" in props ? (
        props.children
      ) : (
        <Icon
          name={props.icon}
          size={16}
          strokeWidth={2}
          className="transition-colors"
        />
      )}
    </button>
  );
});

IconButton.displayName = "IconButton";
