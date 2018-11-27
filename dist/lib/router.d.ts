import { RouteHandler } from './types';
export declare class RouterService {
    private routes;
    private sharedMiddlewares;
    private routeMiddlewares;
    constructor();
    use(...handlers: Array<RouteHandler | string>): void;
    all(routeName: string, ...handlers: RouteHandler[]): void;
    get(routeName: string, ...handlers: RouteHandler[]): void;
    post(routeName: string, ...handlers: RouteHandler[]): void;
    put(routeName: string, ...handlers: RouteHandler[]): void;
    patch(routeName: string, ...handlers: RouteHandler[]): void;
    delete(routeName: string, ...handlers: RouteHandler[]): void;
    route(method: string, routeName: string): RouteHandler[];
    private register;
}
