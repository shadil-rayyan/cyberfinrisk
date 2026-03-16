"use client";

import React from 'react';

interface HydrationErrorBoundaryState {
  hasError: boolean;
}

export default class HydrationErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  HydrationErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    // Check if it's a hydration error
    if (error.message.includes('Hydration') || error.message.includes('hydration')) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log hydration errors in development
    if (process.env.NODE_ENV === 'development' && 
        (error.message.includes('Hydration') || error.message.includes('hydration'))) {
      console.warn('Hydration error caught and suppressed:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render children anyway - hydration errors are usually non-critical
      return this.props.children;
    }

    return this.props.children;
  }
}
