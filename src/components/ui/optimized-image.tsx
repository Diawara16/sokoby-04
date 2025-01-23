import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  loadingClassName,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && "animate-pulse bg-gray-200",
      className
    )}>
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            loadingClassName
          )}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          {...props}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
          <span className="text-sm">Erreur de chargement</span>
        </div>
      )}
    </div>
  );
}