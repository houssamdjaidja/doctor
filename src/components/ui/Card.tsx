import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "glass" | "elevated";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-slate-100",
      glass: "bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl",
      elevated: "bg-white shadow-2xl shadow-slate-200/50",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variants[variant],
          hover && "hover:shadow-xl hover:border-emerald-100 transition-all duration-300",
          className
        )}
        whileHover={hover ? { y: -4 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };