/**
 * Safely stringify a value to JSON, handling circular references.
 */
export function safeJsonStringify(value: unknown, indent?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    },
    indent,
  );
}

/**
 * Safely parse JSON, returning undefined on failure.
 */
export function safeJsonParse<T = unknown>(text: string): T | undefined {
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

/**
 * Sanitize SQL parameters for safe logging — masks strings that look like secrets.
 */
export function sanitizeParams(params?: unknown[]): unknown[] | undefined {
  if (!params) return undefined;
  return params.map((p) => {
    if (typeof p === 'string' && p.length > 50) {
      return `${p.substring(0, 8)}...[TRUNCATED]`;
    }
    return p;
  });
}
