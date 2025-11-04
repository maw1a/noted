import { icons, type LucideProps } from "lucide-react";
import { Keys, keySymbolMap } from "@/utils/constants/key-symbol-map";

export type IconName = keyof typeof icons;

export const Icon = ({ name, ...props }: LucideProps & { name: IconName }) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};

export const KeyIcon = ({ name }: { name: Keys | string }) => {
  if (!(name in keySymbolMap)) {
    return (
      <span
        className="text-display capitalize leading-3.5"
        style={{ width: `${name.trim().length}ch` }}
      >
        {name.trim()}
      </span>
    );
  }
  if (typeof keySymbolMap[name as Keys] === "string")
    return <Icon name={keySymbolMap[name as Keys] as IconName} size={14} />;
  return keySymbolMap[name as Keys];
};

export const Triangle = (props: React.ComponentProps<"svg">) => (
  <svg
    width="8"
    height="4"
    viewBox="0 0 8 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.79289 0C7.23835 0 7.46143 0.538571 7.14645 0.853553L4.35355 3.64645C4.15829 3.84171 3.84171 3.84171 3.64645 3.64645L0.853552 0.853553C0.53857 0.53857 0.761654 0 1.20711 0H6.79289Z"
      fill="currentColor"
    />
  </svg>
);
