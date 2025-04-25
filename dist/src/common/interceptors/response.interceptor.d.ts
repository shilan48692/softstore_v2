import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ISuccessResponse<T> {
    success: true;
    statusCode: number;
    message: string | null;
    data: T;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ISuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ISuccessResponse<T>>;
}
