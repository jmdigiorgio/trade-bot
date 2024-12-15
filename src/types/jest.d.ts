import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (expected: string) => R;
      toBeInTheDocument: () => R;
      toHaveClass: (className: string) => R;
    }
  }
}
