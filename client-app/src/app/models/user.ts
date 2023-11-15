export interface User {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    role?: string;
    photoUrl?: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}
