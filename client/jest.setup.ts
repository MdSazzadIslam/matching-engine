import '@testing-library/jest-dom';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (expected: string | RegExp) => R;
      toBeInTheDocument: () => R;
      toHaveClass: (className: string) => R;
      toContainElement: (element: HTMLElement | null) => R;
    }
  }
}

// Use window instead of global in jsdom environment
window.IS_REACT_ACT_ENVIRONMENT = true;