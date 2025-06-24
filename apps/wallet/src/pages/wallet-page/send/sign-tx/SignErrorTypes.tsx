export interface SignErrorType {
  detect: (error: unknown) => boolean;
  render: (error: unknown) => string;
  type: string;
}

export const SignErrorTypes: SignErrorType[] = [
  {
    detect: (error) =>
      typeof error === 'string' &&
      error.toLowerCase().includes('insufficient funds'),
    render: () => ' Insufficient funds. Please check your balance',
    type: 'InsufficientFunds',
  },
  {
    detect: (error) =>
      typeof error === 'string' && error.toLowerCase().includes('network'),
    render: () => 'Network error. Please try again later.',
    type: 'NetworkError',
  },
  {
    detect: (error) =>
      typeof error === 'string' &&
      error.toLowerCase().includes('invalid address'),
    render: () => ' Request timed out. Try again.',
    type: 'InvalidAddress',
  },
];
