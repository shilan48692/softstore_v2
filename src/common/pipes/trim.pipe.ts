import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(value: any): value is object {
    return typeof value === 'object' && value !== null;
  }

  private trimValue(value: any): any {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
        // Recursively trim strings within arrays
        return value.map(item => this.trimValue(item));
    }
    if (this.isObject(value)) {
      // Recursively trim strings within object properties
      const trimmedObject = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          trimmedObject[key] = this.trimValue(value[key]);
        }
      }
      return trimmedObject;
    }
    // Return non-string, non-array, non-object values as is
    return value;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    // Apply trim logic only to body, query, and param payloads
    const { type } = metadata;
    if (type === 'body' || type === 'query' || type === 'param') {
      if (this.isObject(values)) {
        return this.trimValue(values);
      }
      if (typeof values === 'string') {
          return values.trim();
      }
    }
    // For other types or non-object/non-string values, return as is
    return values;
  }
} 