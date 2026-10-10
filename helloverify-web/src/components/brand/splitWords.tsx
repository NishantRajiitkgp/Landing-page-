import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react";

/** Wraps every word of a copy node in a span of `className`, numbering them
    in reading order as `--i` for a stagger; `n.i` ends as the word count.
    Recurses into elements so `<em>` and `<strong>` keep their own words.
    Splits on whitespace only, so Arabic letters still join. */
export function splitWords(node: ReactNode, className: string, n: { i: number }): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") {
      return child
        .split(/(\s+)/)
        .filter(Boolean)
        .map((part, k) => {
          if (/^\s+$/.test(part)) return part;
          const i = n.i++;
          return (
            <span key={k} className={className} style={{ "--i": i } as CSSProperties}>
              {part}
            </span>
          );
        });
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(child, undefined, splitWords(child.props.children, className, n));
    }
    return child;
  });
}
