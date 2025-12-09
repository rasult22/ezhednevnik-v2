import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Glassmorphism error UI
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
        <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
          {/* Background gradients */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-danger/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
          </div>

          <div className="relative glass max-w-2xl w-full p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold gradient-text-warm mb-3">
                Произошла ошибка
              </h1>
              <p className="text-lg text-text-secondary">
                Приложение столкнулось с неожиданной проблемой
              </p>
            </div>

            {/* Error Details */}
            {this.state.error && (
              <div className="mb-8">
                <details className="bg-danger/10 border border-danger/30 rounded-glass-sm p-4">
                  <summary className="cursor-pointer font-semibold text-danger mb-2">
                    Детали ошибки
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <strong className="text-danger text-sm">Сообщение:</strong>
                      <pre className="text-xs text-text-secondary mt-1 overflow-x-auto bg-dark-400/50 p-2 rounded">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong className="text-danger text-sm">Stack trace:</strong>
                        <pre className="text-xs text-text-muted mt-1 overflow-x-auto max-h-48 bg-dark-400/50 p-2 rounded">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-danger text-sm">Component stack:</strong>
                        <pre className="text-xs text-text-muted mt-1 overflow-x-auto max-h-48 bg-dark-400/50 p-2 rounded">
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
                Перезагрузить страницу
              </Button>

              <Button
                onClick={() => (window.location.href = '/')}
                variant="secondary"
                className="w-full"
              >
                Вернуться на главную
              </Button>

              <div className="border-t border-glass-border pt-4 mt-4">
                <p className="text-sm text-text-muted mb-3 text-center">
                  Если ошибка повторяется:
                </p>
                <Button
                  onClick={this.handleReset}
                  variant="danger"
                  className="w-full"
                >
                  Сбросить все данные
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-glass-border">
              <p className="text-sm text-text-muted text-center">
                Рекомендуем сделать резервную копию данных через настройки перед сбросом
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
