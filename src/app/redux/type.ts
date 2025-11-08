export interface AuthState {
  user: Record<string, any>;
  admin: Record<string, any>;
  active: string;
  isAuthenticate: boolean;
  event: Record<string, any>;
  forgetPassword: Record<string, any>;
}
