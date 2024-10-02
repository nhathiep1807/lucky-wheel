export type TBaseResponse<T> = {
    isSuccess: boolean;
    message: string;
    data: T;
};

interface TypeDateError {
    error: string;
    message: string;
    statusCode: number;
}

export interface TypeErrorResponse {
    response: {
        data: TypeDateError;
        status?: number;
    };
    message: string;
}
