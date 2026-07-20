// Two tests from the same spec_file can hit different serverless instances at once,
// both see "no row yet" and both attempt to INSERT — the DB's unique (build_id,
// spec_file) constraint rejects the loser. Retrying re-runs the read-modify-write,
// which now finds the winner's row and UPDATEs into it instead.

function isDuplicateKeyError(error: unknown): boolean {
  const candidates = [error, (error as { cause?: unknown } | undefined)?.cause];
  return candidates.some((e) => {
    const err = e as { code?: string; errno?: number; message?: string } | undefined;
    return err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062 || /duplicate entry/i.test(err?.message ?? '');
  });
}

export async function withDuplicateKeyRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < attempts && isDuplicateKeyError(error)) continue;
      throw error;
    }
  }
  throw new Error('unreachable');
}
