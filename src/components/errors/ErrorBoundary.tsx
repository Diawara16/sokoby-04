import React from "react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-xl rounded-lg border bg-card p-6">
            <h1 className="text-xl font-semibold text-card-foreground">
              Une erreur est survenue
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              La page n’a pas pu s’afficher. Rechargez, puis réessayez.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => window.location.reload()}>Recharger</Button>
              <Button variant="outline" onClick={this.reset}>
                Réessayer
              </Button>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Détails techniques
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs text-foreground">
                {String(this.state.error?.message || this.state.error)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }
}
