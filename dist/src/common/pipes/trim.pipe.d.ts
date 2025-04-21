import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class TrimPipe implements PipeTransform {
    private isObject;
    private trimValue;
    transform(values: any, metadata: ArgumentMetadata): any;
}
