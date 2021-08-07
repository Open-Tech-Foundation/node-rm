function canRemoveDir(dir: string, ignoreEntries: string[]): boolean {
  const bool = ignoreEntries.some((entry) => entry.startsWith(dir));

  return !bool;
}

export default canRemoveDir;
