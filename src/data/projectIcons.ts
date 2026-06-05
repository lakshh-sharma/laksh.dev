// Project art for the terminal ProjectCard, auto-wired by filename.
//
// Just drop a SQUARE image in src/assets/projects/ named after the project id
// (see profile.ts): craiwl, forge, fpga-cnn. Supported: png/jpg/jpeg/webp/svg.
// No code change needed — it's picked up here automatically. Until a file
// exists for an id, ProjectCard falls back to a colored monogram tile.

const mods = import.meta.glob("../assets/projects/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const PROJECT_ICONS: Record<string, string> = {};
for (const [path, url] of Object.entries(mods)) {
  const id = path.split("/").pop()!.replace(/\.[^.]+$/, "");
  PROJECT_ICONS[id] = url;
}
