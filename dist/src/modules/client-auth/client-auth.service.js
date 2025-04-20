"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
let ClientAuthService = class ClientAuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    generateRandomPassword() {
        return (0, crypto_1.randomBytes)(8).toString('hex');
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: 'CLIENT'
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.fullName,
                picture: user.picture
            }
        };
    }
    async googleLogin(googleLoginDto) {
        let user = await this.usersService.findByEmail(googleLoginDto.email);
        if (!user) {
            const randomPassword = this.generateRandomPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = await this.usersService.create({
                email: googleLoginDto.email,
                name: googleLoginDto.name,
                password: hashedPassword,
                picture: googleLoginDto.picture,
                googleId: googleLoginDto.googleId
            });
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: 'CLIENT'
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.fullName,
                picture: user.picture
            }
        };
    }
};
exports.ClientAuthService = ClientAuthService;
exports.ClientAuthService = ClientAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], ClientAuthService);
//# sourceMappingURL=client-auth.service.js.map