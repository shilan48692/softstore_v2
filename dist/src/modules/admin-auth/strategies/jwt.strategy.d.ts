import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        email: any;
        role: any;
    }>;
}
export {};
