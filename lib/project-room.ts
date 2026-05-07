export function slugifyProjectName(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

export function createRoomSuffix(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length).padEnd(length, "0");
}

export function createRoomId(name: string, suffix = createRoomSuffix()) {
  return `${slugifyProjectName(name)}-${suffix}`;
}