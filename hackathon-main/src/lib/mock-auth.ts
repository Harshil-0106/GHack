export type UserRole = "patient" | "therapist";

export function authenticateMockUser(email: string, password: string): boolean {
  return email.trim().length > 0 && password.length > 0;
}

export function getDashboardPath(role: UserRole): string {
  return role === "patient" ? "/patient/dashboard" : "/therapist/dashboard";
}