import { Suspense } from "react";
import { LoadingSpinner } from "./loading-spinner";

interface LazyComponentProps {
  children: React.ReactNode;
}

export const LazyComponent = ({ children }: LazyComponentProps) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size={32} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};