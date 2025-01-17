import { useToast } from "@/hooks/use-toast";

type ErrorType = {
  message: string;
  code?: string;
  details?: unknown;
};

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: unknown) => {
    console.error("Error caught:", error);

    let errorMessage = "Une erreur inattendue est survenue";
    let errorDetails = undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as ErrorType;
      errorMessage = errorObj.message || errorMessage;
      errorDetails = errorObj.details;
    }

    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      message: errorMessage,
      details: errorDetails,
    };
  };

  return { handleError };
};