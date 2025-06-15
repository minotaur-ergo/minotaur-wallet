export function parseTxError(error: unknown): string {
  if (!error) return 'An unknown error occurred.';

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : ((error as unknown)?.toString?.() ?? 'An error occurred.');

  if (message.includes('insufficient balance'))
    return 'Your wallet has insufficient funds.';
  if (message.includes('network error'))
    return 'Failed to connect. Please check your network.';
  if (message.includes('Invalid address'))
    return 'One of the receiver addresses is invalid.';
  if (message.includes('timeout'))
    return 'The transaction timed out. Please try again.';

  return message;
}
