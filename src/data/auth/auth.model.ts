export type SignInRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  password: string;
  confirmPassword: string;
  resetToken: string;
};
