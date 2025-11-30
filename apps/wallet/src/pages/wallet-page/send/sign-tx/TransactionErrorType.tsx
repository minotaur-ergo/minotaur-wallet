export interface TransactionErrorType {
  detect: (error: string | null) => boolean;
  render: (error: string | null) => string;
}

export const TransactionErrorTypes: TransactionErrorType[] = [
  {
    detect: (error) =>
      error !== null && error.toLowerCase().includes('insufficient funds'),
    render: () => 'Insufficient funds. Please check your balance.',
  },
  {
    detect: (error) =>
      error !== null && error.toLowerCase().includes('network'),
    render: () => 'Network error. Please try again later.',
  },
  {
    detect: (error) =>
      error !== null && error.toLowerCase().includes('invalid address'),
    render: () => 'Invalid address. Please check and try again.',
  },
  {
    detect: (error) =>
      error !== null && error.toLowerCase().includes('time out'),
    render: () => 'Request timed out. Please try again.',
  },
];
