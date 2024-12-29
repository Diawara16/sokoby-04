interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Chargement..." }: LoadingSpinnerProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};