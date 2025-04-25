"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireImpersonation = exports.IMPERSONATION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IMPERSONATION_KEY = 'impersonation';
const RequireImpersonation = () => (0, common_1.SetMetadata)(exports.IMPERSONATION_KEY, true);
exports.RequireImpersonation = RequireImpersonation;
//# sourceMappingURL=impersonation.decorator.js.map