import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextType {
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx?.setOpen(!ctx.open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const ctx = React.useContext(SelectContext);
  const display = ctx?.selectedLabel || ctx?.value || placeholder || "";
  const isPlaceholder = !ctx?.value && !ctx?.selectedLabel;

  return (
    <span className={cn("truncate text-sm", isPlaceholder && "text-muted-foreground")}>
      {display}
    </span>
  );
};

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const ctx = React.useContext(SelectContext);
  if (!ctx?.open) return null;

  return (
    <div
      className={cn(
        "absolute top-[calc(100%+4px)] z-50 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md backdrop-blur-sm animate-in fade-in-80",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className, ...props }) => {
  const ctx = React.useContext(SelectContext);
  const isSelected = ctx?.value === value;

  React.useEffect(() => {
    if (isSelected && typeof children === "string") {
      ctx?.setSelectedLabel(children);
    }
  }, [isSelected, children, ctx]);

  return (
    <div
      onClick={() => {
        if (typeof children === "string") {
          ctx?.setSelectedLabel(children);
        }
        ctx?.onValueChange?.(value);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected && "font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
};
