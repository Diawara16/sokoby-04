import React, { Suspense } from 'react';
import { Loader2 } from "lucide-react";

interface LazyComponentProps {
  children: React.ReactNode;
}

export function LazyComponent({ children }: LazyComponentProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}