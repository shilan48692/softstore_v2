"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKeyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_key_dto_1 = require("./create-key.dto");
class UpdateKeyDto extends (0, mapped_types_1.PartialType)(create_key_dto_1.CreateKeyDto) {
}
exports.UpdateKeyDto = UpdateKeyDto;
//# sourceMappingURL=update-key.dto.js.map