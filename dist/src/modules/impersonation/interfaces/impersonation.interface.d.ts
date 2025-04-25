export interface ImpersonationPayload {
    sub: string;
    email: string;
    username: string;
    isImpersonated: boolean;
    impersonatedBy: string;
}
export interface ImpersonationResponse {
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        fullName: string;
    };
}
