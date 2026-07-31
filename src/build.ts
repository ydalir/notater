import fs from "fs";
import path from "path";
import { markdownToHtml } from "satteri";
import { baseUrlMiddleware } from "./baseUrlMiddleware.ts";

export const build = (baseUrl: string) => {
  const template = fs.readFileSync("template.html", "utf-8");
  console.log("Bygger...");
  if (!fs.existsSync("dist")) fs.mkdirSync("dist");

  const mdFiles = fs.readdirSync("content").filter((f) => f.endsWith(".md"));
  const htmlFiles = fs.readdirSync("dist").filter((f) => f.endsWith(".html"));

  const mdFileNames = mdFiles.map((f) => f.replace(".md", ".html"));
  const oldHtmlFiles = htmlFiles.filter((f) => !mdFileNames.includes(f));

  mdFiles.forEach(async (file) => {
    const markdown = fs.readFileSync(path.join("content", file), "utf-8");
    const htmlContent = await markdownToHtml(markdown, {
      hastPlugins: [baseUrlMiddleware(baseUrl)],
    });

    const finalHtml = template
      .replace("{{content}}", htmlContent.html)
      .replace("{{baseurl}}", baseUrl);

    const outputName = file.replace(".md", ".html");
    fs.writeFileSync(path.join("dist", outputName), finalHtml);
  });

  oldHtmlFiles.forEach((file) => {
    fs.rmSync(path.join("dist", file));
  });

  if (fs.existsSync("style.css")) {
    fs.copyFileSync("style.css", "dist/style.css");
  }
};
