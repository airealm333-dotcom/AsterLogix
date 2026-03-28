export type UserRole =
  | "admin"
  | "user"
  | "pending_writer"
  | "writer"
  | "revoked_writer";

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function isWriter(role: UserRole | null | undefined): boolean {
  return role === "writer";
}

/** Blog publishing from the admin dashboard only. */
export function canPublishBlog(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

