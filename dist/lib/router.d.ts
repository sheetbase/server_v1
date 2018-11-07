export declare class RouterService {
    private routes;
    private sharedMiddlewares;
    private routeMiddlewares;
    constructor();
    use(...handlers: any[]): void;
    all(routeName: string, ...handlers: any[]): void;
    get(routeName: string, ...handlers: any[]): void;
    post(routeName: string, ...handlers: any[]): void;
    put(routeName: string, ...handlers: any[]): void;
    patch(routeName: string, ...handlers: any[]): void;
    delete(routeName: string, ...handlers: any[]): void;
    route(method: string, routeName: string): any;
    private register;
}
