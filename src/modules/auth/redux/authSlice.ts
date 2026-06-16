import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { saveUser, loadUser, clearUser } from "../services/authStorage";
import { setAccessToken } from "../../../core/utils/token";
import type { AuthState } from "../types/auth";
import type { LoginFulfilledPayload } from "./authTypes";
import { singleFlight } from "../../../core/utils/singleFlight";

// ── Initial state ─────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// ── Async thunks ──────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await authApi.login(credentials);

      setAccessToken(data.accessToken);
      saveUser(data.user);

      return {
        accessToken: data.accessToken,
        user: data.user,
      } satisfies LoginFulfilledPayload;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err) ?? "Login failed");
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    const { accessToken, user } = await singleFlight("auth-refresh", async () =>
      authApi.refresh(),
    );

    setAccessToken(accessToken);
    saveUser(user);

    return { user };
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch (err) {
    // Ignore network errors on logout
  } finally {
    setAccessToken(null);
    clearUser();
  }
});

// ── Slice ─────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    preloadUser(state) {
      const cached = loadUser();
      if (cached && !state.user) {
        state.user = cached;
      }
    },
  },
  extraReducers: (builder) => {
    // ── login ──────────────────────────────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginFulfilledPayload>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── restoreSession ─────────────────────────────────────────
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isInitialized = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isInitialized = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
      });

    // ── logout ──────────────────────────────────────────────────
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { clearError, preloadUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

function extractErrorMessage(err: unknown): string | undefined {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg[0];
  return undefined;
}
