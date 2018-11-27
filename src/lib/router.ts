import { RouteHandler } from './types';

export class RouterService {
    private routes = {};
    private sharedMiddlewares = [];
    private routeMiddlewares = {};

    constructor () {}

    use(...handlers: Array<RouteHandler | string>): void {
        if (typeof handlers[0] === 'string') {
            const routeName = handlers.shift() as string;
            this.routeMiddlewares['GET:' + routeName] = handlers;
            this.routeMiddlewares['POST:' + routeName] = handlers;
            this.routeMiddlewares['PUT:' + routeName] = handlers;
            this.routeMiddlewares['PATCH:' + routeName] = handlers;
            this.routeMiddlewares['DELETE:' + routeName] = handlers;
        } else {
            this.sharedMiddlewares = this.sharedMiddlewares.concat(handlers);
        }
    }

    all(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('ALL', routeName, ...handlers);
    }
    get(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('GET', routeName, ...handlers);
    }
    post(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('POST', routeName, ...handlers);
    }
    put(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('PUT', routeName, ...handlers);
    }
    patch(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('PATCH', routeName, ...handlers);
    }
    delete(routeName: string, ...handlers: RouteHandler[]): void {
        this.register('DELETE', routeName, ...handlers);
    }

    route(method: string, routeName: string): RouteHandler[] {
        const notFoundHandler: RouteHandler = (req, res) => {
            try {
                return res.render('errors/404');
            } catch (error) {
                return res.html(`
					<h1>404!</h1>
					<p>Not found.</p>
				`);
            }
        };
        const handler = this.routes[method + ':' + routeName] || notFoundHandler;
        let handlers = this.routeMiddlewares[method + ':' + routeName] || [];
        // shared middlewares
        handlers = this.sharedMiddlewares.concat(handlers);
        // main handler
        handlers.push(handler);
        return handlers;
    }

    private register(method: string, routeName: string, ...handlers: RouteHandler[]): void {
        // remove invalid handlers
        for (let i = 0; i < handlers.length; i++) {
            if (!handlers[i] || (i !== 0 && !(handlers[i] instanceof Function))) {
                handlers.splice(i, 1);
            }
        }
        // register
        method = method || 'ALL';
        const handler = handlers.pop();
        if (method === 'ALL' || method === 'GET') {
            this.routes['GET:' + routeName] = handler;
            this.routeMiddlewares['GET:' + routeName] = handlers;
        }
        if (method === 'ALL' || method === 'POST') {
            this.routes['POST:' + routeName] = handler;
            this.routeMiddlewares['POST:' + routeName] = handlers;
        }
        if (method === 'ALL' || method === 'PUT') {
            this.routes['PUT:' + routeName] = handler;
            this.routeMiddlewares['PUT:' + routeName] = handlers;
        }
        if (method === 'ALL' || method === 'PATCH') {
            this.routes['PATCH:' + routeName] = handler;
            this.routeMiddlewares['PATCH:' + routeName] = handlers;
        }
        if (method === 'ALL' || method === 'DELETE') {
            this.routes['DELETE:' + routeName] = handler;
            this.routeMiddlewares['DELETE:' + routeName] = handlers;
        }
    }
}