import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the standardized success response structure
export interface ISuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string | null; // Optional success message
  data: T;               // The actual data payload
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ISuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ISuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK; // Get status code set by controller or default to OK

    return next.handle().pipe(
      map(data => {
        // Check if the data is already in a structured format (e.g., from pagination)
        // If it has a 'data' property and maybe 'meta' or 'links', assume it's structured.
        // You might need to adjust this check based on your specific pagination/structured response formats.
        if (typeof data === 'object' && data !== null && ('data' in data || 'items' in data)) {
           // If it seems structured, return it as is, but ensure standard fields if missing
           return {
             success: true,
             statusCode: statusCode,
             message: data.message || null, // Preserve existing message if any
             ...data, // Spread the original structured data
           };
        }

        // If data is not structured, wrap it in the standard format
        return {
          success: true,
          statusCode: statusCode,
          message: null, // Default to null message for simple data responses
          data: data,
        };
      }),
    );
  }
} 