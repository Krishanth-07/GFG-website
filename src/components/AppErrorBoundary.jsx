import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-comic-yellow)] p-6">
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-6 shadow-[8px_8px_0_#000]">
            <h1 className="display-comic text-3xl text-black">Something Went Wrong</h1>
            <p className="mt-3 text-sm font-bold text-black/80">
              The page crashed while rendering. Please refresh once. If it still happens, share the error text below.
            </p>
            <pre className="mt-4 max-h-80 overflow-auto rounded-lg border-[2px] border-black bg-white p-3 text-xs font-bold text-red-700 whitespace-pre-wrap break-words">
              {this.state.error?.stack || this.state.error?.message || 'Unknown runtime error'}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
