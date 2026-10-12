import { HttpErrorResponse } from '@angular/common/http';
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { message?: unknown } | null;
    if (typeof body?.message === 'string') return body.message;
    if (error.status === 0) return 'Could not reach the service. Check the server, network and CORS.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'Unexpected request failure';
}