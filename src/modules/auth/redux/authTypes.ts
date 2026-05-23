import type { User } from "../types/auth";

/**
 * Explicit payload types for async thunk fulfilled actions.
 * Keeping these separate from domain types avoids polluting the
 * domain model with Redux-specific concerns.
 */

export interface LoginFulfilledPayload {
  accessToken: string;
  user: User;
}

export interface RestoreSessionFulfilledPayload {
  user: User;
}
