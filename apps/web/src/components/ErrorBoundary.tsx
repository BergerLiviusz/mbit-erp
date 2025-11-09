import { Component, ErrorInfo, ReactNode } from 'react';

const isElectron = !!(window as any).electron || (navigator.userAgent.includes('Electron'));

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to debug panel if available
    if (isElectron) {
      import('./DebugPanel').then(module => {
        module.addLog('error', `React Error: ${error.message}`, {
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }).catch(() => {
        // DebugPanel not available
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Hiba történt</h1>
            <p className="text-gray-700 mb-4">
              Az alkalmazás váratlan hibát észlelt. Kérjük, frissítse az oldalt vagy indítsa újra az alkalmazást.
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">Technikai részletek</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Oldal frissítése
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

