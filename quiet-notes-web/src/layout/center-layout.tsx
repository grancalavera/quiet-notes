import { ReactNode } from "react";
import { block } from "../app/bem";
import "./center-layout.scss";

const b = block("center-layout");

interface CenterLayoutProps {
  children?: ReactNode;
  className?: string;
}

export const CenterLayout = ({ children, ...props }: CenterLayoutProps) => {
  return <div className={b({}).mix(props.className)}>{children}</div>;
};
