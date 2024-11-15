export interface User {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    imageurl: string | null;
    isBlocked: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}