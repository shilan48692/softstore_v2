import { SetMetadata } from '@nestjs/common';

export const IMPERSONATION_KEY = 'impersonation';
export const RequireImpersonation = () => SetMetadata(IMPERSONATION_KEY, true); 