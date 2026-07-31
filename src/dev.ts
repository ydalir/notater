import { build } from "./build.ts";
import browserSync from "browser-sync";
import chokidar from "chokidar";

build("/");

const bsInstance = browserSync.create();

bsInstance.init({
  server: "./dist",
  files: ["./dist/*"],
});

chokidar.watch(["./content", "template.html", "style.css"]).on("change", () => {
  build("/");
  bsInstance.reload();
});
