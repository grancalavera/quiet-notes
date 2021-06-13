import { block } from "../app/bem";
import "./toolbar.scss";

const b = block("toolbar");

export const Toolbar = () => <div className={b()}>Toolbar</div>;
