export type TLoginRequest = {
    phoneNumber: string;
    password: string;
};

export type TProfile = {
    id: number;
    name: string;
    phoneNumber: string;
    totalPoints: string;
};

export type TPlayer = {
    id: number;
    name: string;
    role: string;
    phoneNumber: string;
    totalPoints: string;
};

export type TLoginResponse = {
    access_token: string;
    user: TProfile;
};