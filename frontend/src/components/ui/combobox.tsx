import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/utils/cn";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Icon } from "@/components/icon";

type ComboboxProps = {
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: ReactNode;
  items: Array<{ value: string; label: string }>;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  unselectable?: boolean;
};

export function Combobox({
  placeholder,
  searchPlaceholder,
  notFoundText,
  items,
  defaultValue = "",
  onSelect,
  unselectable = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between py-1.5 data-[state=open]:bg-dark-tint data-[state=open]:backdrop-blur-xs"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <Icon
            name="ChevronsUpDown"
            className="ml-2 h-4 w-4 shrink-0 text-text-muted"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 border-none">
        <Command className="bg-transparent backdrop-blur-none">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{notFoundText}</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue === value && unselectable ? "" : currentValue,
                  );
                  setOpen(false);
                  onSelect?.(currentValue);
                }}
              >
                <Icon
                  name="Check"
                  className={cn(
                    "mr-2 h-4 w-4 text-text",
                    value === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
