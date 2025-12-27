import { Card, CardContent } from "@/components/common/Card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  onClick 
}) => {
  const variants = {
    default: "bg-white border-slate-200",
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        variants[variant],
        onClick && "hover:border-blue-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              variant === "primary" && "bg-blue-100",
              variant === "success" && "bg-green-100",
              variant === "warning" && "bg-yellow-100",
              variant === "danger" && "bg-red-100",
              variant === "default" && "bg-slate-100"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                variant === "primary" && "text-blue-600",
                variant === "success" && "text-green-600",
                variant === "warning" && "text-yellow-600",
                variant === "danger" && "text-red-600",
                variant === "default" && "text-slate-600"
              )} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

