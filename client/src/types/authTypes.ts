  
export interface UserActionPayload {
    email: string | null;
    accessToken: string | null;
}
  

export interface User {
    name: string | null;
    email: string | null;
    phone: string | null;
    imageURL: string | null;
    isBlocked: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserActionPayload;
    profile: User;
}
  