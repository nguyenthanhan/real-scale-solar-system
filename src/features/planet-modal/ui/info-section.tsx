"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function InfoSection({
  title,
  children,
  icon,
  collapsible = false,
  defaultExpanded = true,
}: InfoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="border-t border-white/10 pt-3">
      <button
        onClick={handleToggle}
        disabled={!collapsible}
        className={`flex items-center gap-2 w-full text-left ${
          collapsible
            ? "cursor-pointer hover:text-blue-300 transition-colors"
            : "cursor-default"
        }`}
        aria-expanded={isExpanded}
      >
        {icon && <span className="text-blue-400">{icon}</span>}
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        {collapsible && (
          <span className="ml-auto text-white/50">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
