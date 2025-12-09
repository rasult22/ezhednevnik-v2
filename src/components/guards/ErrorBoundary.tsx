import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../layout/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches React errors and displays a fallback UI
 *
 * Features:
 * - Catches errors in child components
 * - Displays user-friendly error message
 * - Shows error details in development
 * - Provides reload and reset options
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    if (
      window.confirm(
        'Это удалит все данные и перезагрузит приложение. Продолжить?'
      )
    ) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Произошла ошибка
              </h1>
              <p className="text-lg text-gray-600">
                Приложение столкнулось с неожиданной проблемой
              </p>
            </div>

            {/* Error Details (Development) */}
            {this.state.error && (
              <div className="mb-6">
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                    Детали ошибки (только в режиме разработки)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong className="text-red-800">Сообщение:</strong>
                      <pre className="text-xs text-red-700 mt-1 overflow-x-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong className="text-red-800">Stack trace:</strong>
                        <pre className="text-xs text-red-700 mt-1 overflow-x-auto max-h-48">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-red-800">
                          Component stack:
                        </strong>
                        <pre className="text-xs text-red-700 mt-1 overflow-x-auto max-h-48">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                variant="primary"
                className="w-full"
                size="lg"
              >
                🔄 Перезагрузить страницу
              </Button>

              <Button
                onClick={() => (window.location.href = '/')}
                variant="secondary"
                className="w-full"
              >
                🏠 Вернуться на главную
              </Button>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  Если ошибка повторяется:
                </p>
                <Button
                  onClick={this.handleReset}
                  variant="secondary"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  🗑️ Сбросить все данные
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Рекомендуем сделать резервную копию данных через настройки перед
                сбросом
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
