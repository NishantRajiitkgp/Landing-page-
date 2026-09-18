/** Logical CSS properties in inline styles (BUILD-SPEC §12, §7, §14.2).
 *
 *  `npm run check:logical` enforces this for the stylesheets and converted 192
 *  declarations there. It cannot see `style={{ marginLeft: 12 }}` in a component,
 *  because that is JavaScript rather than CSS — which is exactly the gap §14.2
 *  means when it asks for the rule "incl. token + logical-property rules".
 *
 *  Why it matters: §7 ships an Arabic locale. Set `dir="rtl"` and every
 *  `marginLeft` stays on the left, so the layout comes apart instead of
 *  mirroring. A physical property in an inline style is invisible to the
 *  stylesheet gate and would be the one thing left holding RTL back.
 *
 *  ONLY THE INLINE AXIS, which is the same scope the stylesheet gate uses and
 *  for the same reason: in a horizontal writing mode RTL flips inline, not
 *  block. `marginTop` means the same thing in Arabic as in English, and a rule
 *  that fires on correct code gets disabled.
 */

/** Physical -> logical, inline axis only. */
const PHYSICAL = new Map([
  ["marginLeft", "marginInlineStart"],
  ["marginRight", "marginInlineEnd"],
  ["paddingLeft", "paddingInlineStart"],
  ["paddingRight", "paddingInlineEnd"],
  ["borderLeft", "borderInlineStart"],
  ["borderRight", "borderInlineEnd"],
  ["borderLeftWidth", "borderInlineStartWidth"],
  ["borderRightWidth", "borderInlineEndWidth"],
  ["borderLeftColor", "borderInlineStartColor"],
  ["borderRightColor", "borderInlineEndColor"],
  ["borderLeftStyle", "borderInlineStartStyle"],
  ["borderRightStyle", "borderInlineEndStyle"],
  ["left", "insetInlineStart"],
  ["right", "insetInlineEnd"],
  ["scrollMarginLeft", "scrollMarginInlineStart"],
  ["scrollPaddingLeft", "scrollPaddingInlineStart"],
]);

/** Properties whose VALUE is directional. */
const DIRECTIONAL_VALUES = new Map([
  ["textAlign", { left: "start", right: "end" }],
  ["float", { left: "inline-start", right: "inline-end" }],
  ["clear", { left: "inline-start", right: "inline-end" }],
]);

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    /** Fixable because every replacement is value-identical in a left-to-right
     *  horizontal writing mode: `marginLeft` and `marginInlineStart` compute to
     *  the same pixel until `dir` flips. So `eslint --fix` cannot change how the
     *  site renders today, only how it renders in Arabic. */
    fixable: "code",
    docs: {
      description:
        "Inline styles must use logical properties so the layout can mirror " +
        "under dir=rtl.",
    },
    schema: [],
    messages: {
      property:
        "`{{physical}}` cannot mirror under dir=rtl. Use `{{logical}}`.",
      value:
        "`{{property}}: \"{{value}}\"` cannot mirror under dir=rtl. Use `\"{{logical}}\"`.",
    },
  },

  create(context) {
    /** Only object literals that are actually a `style` prop. `{ left: 4 }` in a
     *  data structure is not a CSS declaration, and reporting it would be the
     *  false positive that gets the rule turned off. */
    function inStyleProp(node) {
      let n = node.parent;
      let depth = 0;
      while (n && depth++ < 6) {
        if (
          n.type === "JSXAttribute" &&
          n.name?.type === "JSXIdentifier" &&
          n.name.name === "style"
        ) {
          return true;
        }
        n = n.parent;
      }
      return false;
    }

    return {
      Property(node) {
        const key =
          node.key?.type === "Identifier"
            ? node.key.name
            : node.key?.type === "Literal"
              ? node.key.value
              : null;
        if (typeof key !== "string") return;
        if (!inStyleProp(node)) return;

        const logical = PHYSICAL.get(key);
        if (logical) {
          context.report({
            node: node.key,
            messageId: "property",
            data: { physical: key, logical },
            fix: (fixer) => fixer.replaceText(node.key, logical),
          });
          return;
        }

        const directional = DIRECTIONAL_VALUES.get(key);
        if (directional && node.value?.type === "Literal") {
          const replacement = directional[node.value.value];
          if (replacement) {
            context.report({
              node: node.value,
              messageId: "value",
              data: { property: key, value: node.value.value, logical: replacement },
              fix: (fixer) => fixer.replaceText(node.value, JSON.stringify(replacement)),
            });
          }
        }
      },
    };
  },
};
