export function singleFlight<T>(key: string, fn: () => Promise<T>) {
  const globalAny = globalThis as any;

  globalAny.__sf ||= {};

  if (globalAny.__sf[key]) {
    return globalAny.__sf[key];
  }

  globalAny.__sf[key] = fn().finally(() => {
    delete globalAny.__sf[key];
  });

  return globalAny.__sf[key];
}
