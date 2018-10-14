import { IRouteHandler } from '../index';

export class Router {
    private _routes = {};
    private _sharedMiddlewares = [];
    private _routeMiddlewares = {};

    constructor () {}

    use(...handlers: any[]) {
        if (!!handlers[0] && handlers[0] instanceof Function) {
            this._sharedMiddlewares = this._sharedMiddlewares.concat(handlers);
        } else {
            const routeName = handlers.shift();
            this._register('ALL', routeName, handlers);
        }
    }

    all(routeName: string, ...handlers: any[]) {
        this._register('ALL', routeName, ...handlers);
    }
    get(routeName: string, ...handlers: any[]) {
        this._register('GET', routeName, ...handlers);
    }
    post(routeName: string, ...handlers: any[]) {
        this._register('POST', routeName, ...handlers);
    }
    put(routeName: string, ...handlers: any[]) {
        this._register('PUT', routeName, ...handlers);
    }        
    patch(routeName: string, ...handlers: any[]) {
        this._register('PATCH', routeName, ...handlers);
    }
    delete(routeName: string, ...handlers: any[]) {
        this._register('DELETE', routeName, ...handlers);
    }        

    route(method: string, routeName: string) {
        var notFoundHandler: IRouteHandler = (req, res) => {
            try {                    
                return res.render('errors/404');
            } catch (error) {
                return res.html(`
					<h1>404!</h1>
					<p>Not found.</p>
				`);
            }
        };
        let handler = this._routes[method + ':' + routeName] || notFoundHandler;
        let handlers = this._routeMiddlewares[method + ':' + routeName] || [];
        // shared middlewares
        handlers = this._sharedMiddlewares.concat(handlers);
        // main handler
        handlers.push(handler);
        return handlers;
    }

    private _register(method: string, routeName: string, ...handlers: any[]) {
        if (!routeName) {
            throw new Error('Invalid route name.');
        }
        if(handlers.length < 1) {
            throw new Error('No handlers.');
        }
        // remove invalid handlers
        for (let i = 0; i < handlers.length; i++) {
            if (!handlers[i] || (i !== 0 && !(handlers[i] instanceof Function))) {
                handlers.splice(i, 1);
            }
        }
        // register
        method = method || 'ALL';
        let handler = handlers.pop();
        if (method === 'ALL' || method === 'GET') {
            this._routes['GET:'+ routeName] = handler;
            this._routeMiddlewares['GET:'+ routeName] = handlers;
        }
        if (method === 'ALL' || method === 'POST') {
            this._routes['POST:'+ routeName] = handler;
            this._routeMiddlewares['POST:'+ routeName] = handlers;
        }
        if (method === 'ALL' || method === 'PUT') {
            this._routes['PUT:'+ routeName] = handler;
            this._routeMiddlewares['PUT:'+ routeName] = handlers;
        }            
        if (method === 'ALL' || method === 'PATCH') {
            this._routes['PATCH:'+ routeName] = handler;
            this._routeMiddlewares['PATCH:'+ routeName] = handlers;
        }
        if (method === 'ALL' || method === 'DELETE') {
            this._routes['DELETE:'+ routeName] = handler;
            this._routeMiddlewares['DELETE:'+ routeName] = handlers;
        }
    }
}