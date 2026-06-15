import { Component, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Maaf, halaman ini mengalami masalah. Silakan muat ulang.
            </p>
            <Button onClick={this.handleReset}>Muat Ulang Halaman</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}