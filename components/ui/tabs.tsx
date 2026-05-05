"use client";

import React from "react";

import { cn } from "../../lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({
  children,
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center rounded-xl border border-surface-border bg-subtle p-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = ({
  children,
  className,
  value,
  onClick,
  type = "button",
  ...props
}: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const active = context.value === value;

  return (
    <button
      role="tab"
      type={type}
      aria-selected={active}
      onClick={(event) => {
        context.setValue(value);
        onClick?.(event);
      }}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
        active
          ? "bg-elevated text-copy-primary shadow-sm"
          : "text-copy-muted hover:text-copy-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = ({
  children,
  className,
  value,
  ...props
}: TabsContentProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tabs;
