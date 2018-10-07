import { IModule, IApp, IConfigs } from './types/module';
import { Config } from './config';
import { Http } from './http';
import { Request } from './request';
import { Response } from './response';
import { Router } from './router';

const config = new Config();
const router = new Router();
const request = new Request();
const response = new Response(config);
const http = new Http(config, router, response);
const app = (configs: IConfigs = {}): IApp => {
    config.set(configs);
    return {
        // router
        use: router.use,
        all: router.all,
        get: router.get,
        post: router.post,
        put: router.put,
        patch: router.patch,
        delete: router.delete,
        // config
        set: config.set
    };
}

export const moduleExports: IModule = {
    app,
    Config: config,
    Router: router,
    Request: request,
    Response: response,
    HTTP: http
};