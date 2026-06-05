// Square logos/photos for the terminal ExperienceCard, auto-wired by filename.
//
// Drop a SQUARE image in src/assets/experience/ named after the experience id
// (see profile.ts): silicon-data, otcr, ncsa. Supported: png/jpg/jpeg/webp/svg.
// They render in a 1:1 slot with object-fit: cover, so non-square art is cropped.
// Until a file exists for an id, ExperienceCard falls back to a monogram tile.

const mods = import.meta.glob("../assets/experience/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const EXPERIENCE_ICONS: Record<string, string> = {};
for (const [path, url] of Object.entries(mods)) {
  const id = path.split("/").pop()!.replace(/\.[^.]+$/, "");
  EXPERIENCE_ICONS[id] = url;
}
