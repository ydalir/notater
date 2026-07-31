import type { HastPluginDefinition } from "satteri";

export const baseUrlMiddleware: (baseUrl: string) => HastPluginDefinition = (
  baseUrl: string,
) => ({
  name: "base-url",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties.href;
      if (typeof href !== "string") return;

      if (href.startsWith("http")) {
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener noreferrer");
      } else {
        ctx.setProperty(
          node,
          "href",
          `${baseUrl}${href.replace(".md", ".html")}`,
        );
      }
    },
  },
});
