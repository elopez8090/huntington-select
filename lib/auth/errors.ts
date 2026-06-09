export function getAuthErrorMessage(error: { message: string }): string {
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("user already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (msg.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("unable to validate email address")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  return error.message;
}
