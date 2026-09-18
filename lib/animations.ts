export function animationsEnabled(): boolean {
  // Default: animations disabled to avoid hydration/client-routing mismatches.
  // Enable by setting NEXT_PUBLIC_ENABLE_ANIMATIONS=1 in the environment.
  try {
    return process?.env?.NEXT_PUBLIC_ENABLE_ANIMATIONS === "1";
  } catch {
    return false;
  }
}
