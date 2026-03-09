// Learn more: https://github.com/testing-library/jest-dom
// Use CommonJS require to avoid ESM issues in Jest setup
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@testing-library/jest-dom");

// Mock lucide-react icons to avoid ESM and JSX issues in Jest setup
// Use React.createElement; do not use JSX in this file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require("react");

jest.mock("lucide-react", () => {
  const mk = (testId) =>
    jest.fn(({ className, ...props }) =>
      React.createElement(
        "span",
        { className, "data-testid": testId, ...props },
        null
      )
    );
  return {
    ChevronLeft: mk("chevron-left-icon"),
    ChevronRight: mk("chevron-right-icon"),
    Calendar: mk("calendar-icon"),
    Clock: mk("clock-icon"),
  };
});

// Mock Next.js App Router hooks to avoid "expected app router to be mounted" errors in tests
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    })),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(""),
  };
});

// Mock legacy next/router as well, in case any component uses it
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    asPath: "/",
    route: "/",
    pathname: "/",
    query: {},
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    beforePopState: jest.fn(),
  }),
}));
