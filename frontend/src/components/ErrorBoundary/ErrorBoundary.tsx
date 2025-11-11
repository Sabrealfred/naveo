import React, { Component, type ReactNode } from 'react';
import { Result, Button, Typography, Card, Space } from 'antd';
import { BugOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // If custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      const isDevelopment = import.meta.env.DEV;

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: '#f0f2f5',
          }}
        >
          <Card style={{ maxWidth: 800, width: '100%' }}>
            <Result
              status="error"
              icon={<BugOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
              title="Oops! Something went wrong"
              subTitle="We're sorry for the inconvenience. The application encountered an unexpected error."
              extra={[
                <Button
                  key="reset"
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>,
                <Button
                  key="home"
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>,
              ]}
            />

            {isDevelopment && error && (
              <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                <Card type="inner" title="Error Details (Development Only)">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Error Message:</Text>
                      <Paragraph
                        code
                        copyable
                        style={{
                          marginTop: 8,
                          padding: 12,
                          backgroundColor: '#fff1f0',
                          border: '1px solid #ffccc7',
                          borderRadius: 4,
                        }}
                      >
                        {error.message}
                      </Paragraph>
                    </div>

                    {error.stack && (
                      <div>
                        <Text strong>Stack Trace:</Text>
                        <Paragraph
                          code
                          copyable
                          style={{
                            marginTop: 8,
                            padding: 12,
                            backgroundColor: '#fafafa',
                            border: '1px solid #d9d9d9',
                            borderRadius: 4,
                            maxHeight: 300,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                            fontSize: 12,
                          }}
                        >
                          {error.stack}
                        </Paragraph>
                      </div>
                    )}

                    {errorInfo && errorInfo.componentStack && (
                      <div>
                        <Text strong>Component Stack:</Text>
                        <Paragraph
                          code
                          copyable
                          style={{
                            marginTop: 8,
                            padding: 12,
                            backgroundColor: '#fafafa',
                            border: '1px solid #d9d9d9',
                            borderRadius: 4,
                            maxHeight: 200,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                            fontSize: 12,
                          }}
                        >
                          {errorInfo.componentStack}
                        </Paragraph>
                      </div>
                    )}
                  </Space>
                </Card>
              </Space>
            )}
          </Card>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
