import { useState } from "react";
import { useSignUp } from "./auth/useSignUp";
import { useSignIn } from "./auth/useSignIn";

export const useAuthForm = (defaultIsSignUp: boolean = false) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  
  const { isLoading: isSignUpLoading, error: signUpError, handleSignUp } = useSignUp();
  const { isLoading: isSignInLoading, error: signInError, handleSignIn } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignUp(email, password, dateOfBirth);
    } else {
      await handleSignIn(email, password);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    dateOfBirth,
    setDateOfBirth,
    isLoading: isSignUp ? isSignUpLoading : isSignInLoading,
    isSignUp,
    setIsSignUp,
    handleSubmit,
    error: isSignUp ? signUpError : signInError,
  };
};