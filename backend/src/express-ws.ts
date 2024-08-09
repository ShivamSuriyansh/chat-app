import * as express from 'express';
import * as core from 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Express extends core.Application {
        ws: any;
    }
}
