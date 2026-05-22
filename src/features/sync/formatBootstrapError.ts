import { ZodError } from 'zod';

export function formatBootstrapError(e: unknown): string {
  if (e instanceof ZodError) {
    const lines = e.issues.slice(0, 5).map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'album';
      return `${path}: ${issue.message}`;
    });
    const more = e.issues.length > 5 ? ` (+${e.issues.length - 5} more)` : '';
    return `Invalid album content — ${lines.join('; ')}${more}`;
  }
  if (e instanceof Error) return e.message;
  return 'BOOTSTRAP_ERROR';
}
