let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string): void {
  _accessToken = token;
}

export function clearAccessToken(): void {
  _accessToken = null;
}

export function decodeToken<T = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken<{ exp: number }>(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}
