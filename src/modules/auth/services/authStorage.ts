import { STORAGE_KEYS } from "../../../core/constants";
import type { User } from "../types/auth";

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}
