import { cn } from "@/lib/utils";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-slate-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("px-6 py-4 border-b border-slate-200", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

