import type { Request } from 'express';

export type HelloWorldReq = Request & { hello?: string };
