import { NextRequest } from 'next/server';
export declare const config: {
    api: {
        bodyParser: boolean;
    };
};
export declare function POST(req: NextRequest): Promise<any>;
