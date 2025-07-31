import * as React from "react";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

function variantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "default":
      return "bg-primary text-primary-foreground hover:bg-primary/80";
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    case "outline":
      return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    case "ghost":
      return "hover:bg-accent hover:text-accent-foreground";
    case "link":
      return "text-primary underline-offset-4 hover:underline";
    default:
      return "";
  }
}

function sizeClasses(size: ButtonSize) {
  switch (size) {
    case "default":
      return "h-10 px-4 py-2";
    case "sm":
      return "h-9 rounded-md px-3";
    case "lg":
      return "h-11 rounded-md px-8";
    case "icon":
      return "h-10 w-10";
    default:
      return "";
  }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp: React.ElementType = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sm ${variantClasses(
          variant
        )} ${sizeClasses(size)} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
