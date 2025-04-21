"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimPipe = void 0;
const common_1 = require("@nestjs/common");
let TrimPipe = class TrimPipe {
    isObject(value) {
        return typeof value === 'object' && value !== null;
    }
    trimValue(value) {
        if (typeof value === 'string') {
            return value.trim();
        }
        if (Array.isArray(value)) {
            return value.map(item => this.trimValue(item));
        }
        if (this.isObject(value)) {
            const trimmedObject = {};
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    trimmedObject[key] = this.trimValue(value[key]);
                }
            }
            return trimmedObject;
        }
        return value;
    }
    transform(values, metadata) {
        const { type } = metadata;
        if (type === 'body' || type === 'query' || type === 'param') {
            if (this.isObject(values)) {
                return this.trimValue(values);
            }
            if (typeof values === 'string') {
                return values.trim();
            }
        }
        return values;
    }
};
exports.TrimPipe = TrimPipe;
exports.TrimPipe = TrimPipe = __decorate([
    (0, common_1.Injectable)()
], TrimPipe);
//# sourceMappingURL=trim.pipe.js.map