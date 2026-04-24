/** True when a public env var is set to a common “on” value (trimmed, case-insensitive). */
export function isPublicEnvTruthy(value: string | undefined): boolean {
  const v = value?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
