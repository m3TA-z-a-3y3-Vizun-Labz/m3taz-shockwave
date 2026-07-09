import { net } from 'electron';

export const MAIN_FETCH_TIMEOUT_MS = 30_000;

/** Outbound HTTP — Chromium stack first (proxy/VPN), Node fetch as fallback. */
export async function mainFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let lastErr: any = null;
  const actualInit = init?.signal
    ? init
    : { ...init, signal: AbortSignal.timeout(MAIN_FETCH_TIMEOUT_MS) };

  for (const attempt of [tryNetFetch, tryNodeFetch]) {
    try {
      return await attempt(input, actualInit);
    } catch (err: any) {
      lastErr = err;
      console.warn(
        '[mainFetch] attempt failed:',
        err?.message,
        err?.cause?.code || err?.cause?.message || '',
      );
    }
  }
  throw lastErr;
}

function tryNetFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return net.fetch(input, init);
}

function tryNodeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}

/** Turn a fetch rejection into a short, user-facing message. */
export function formatFetchError(err: any): string {
  const msg = String(err?.message || '');
  const causeCode = err?.cause?.code;
  const causeMsg = err?.cause?.message;

  if (err?.name === 'TimeoutError' || /aborted due to timeout/i.test(msg)) {
    return 'Connection timed out';
  }
  if (/fetch failed|ERR_FAILED|ERR_CONNECTION/i.test(msg)) {
    if (causeCode) return `Could not reach GitHub (${causeCode})`;
    if (causeMsg) return `Could not reach GitHub (${causeMsg})`;
    return 'Could not reach GitHub — check your internet connection or VPN/proxy settings';
  }
  return msg || 'Network request failed';
}
