import { RouteHandler, RoutingErrors, ResponseError } from './types';
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
    /**
     * Helpers
     */
    errorBuilder(errors: RoutingErrors, handler: {
        (err: ResponseError): any;
    }): {
        (code?: string): any;
    };
    routingError(errors: RoutingErrors, handler: {
        (err: ResponseError): any;
    }, code?: string): any;
    exposeChecker(disabledRoutes: string | string[]): {
        (method: string, routeName: string): boolean;
    };
    enabledRoute(disabledRoutes: string | string[], method: string, routeName: string): boolean;
}
