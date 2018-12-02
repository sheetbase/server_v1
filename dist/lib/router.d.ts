import { RouteHandler, RoutingErrors } from './types';
import { OptionService } from './option';
export declare class RouterService {
    private optionService;
    private routes;
    private sharedMiddlewares;
    private routeMiddlewares;
    constructor(optionService: OptionService);
    setErrors(errors: RoutingErrors, override?: boolean): void;
    setDisabled(disabledRoutes: string[], override?: boolean): void;
    use(...handlers: Array<RouteHandler | string>): void;
    all(routeName: string, ...handlers: RouteHandler[]): void;
    get(routeName: string, ...handlers: RouteHandler[]): void;
    post(routeName: string, ...handlers: RouteHandler[]): void;
    put(routeName: string, ...handlers: RouteHandler[]): void;
    patch(routeName: string, ...handlers: RouteHandler[]): void;
    delete(routeName: string, ...handlers: RouteHandler[]): void;
    route(method: string, routeName: string): RouteHandler[];
    private register;
    private disabled;
}
