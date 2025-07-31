import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function badgeClasses(variant: BadgeVariant) {
  switch (variant) {
    case "default":
      return "bg-primary text-primary-foreground";
    case "secondary":
      return "bg-secondary text-secondary-foreground";
    case "destructive":
      return "bg-destructive text-destructive-foreground";
    case "outline":
      return "text-foreground border border-border";
    default:
      return "";
  }
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${badgeClasses(
        variant
      )} ${className}`}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
