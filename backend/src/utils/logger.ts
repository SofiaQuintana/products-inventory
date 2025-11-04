export function logger(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, ...args);
}

export function logError(message: string, error: any): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`, error);
}

export function logSuccess(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✓ ${message}`, ...args);
}

export function logWarning(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠ ${message}`, ...args);
}
