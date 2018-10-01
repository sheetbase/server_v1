export interface IAppConfigs {
    // system
    allowMethodsWhenDoGet?: boolean;
    // custom
    [key: string]: any;
}

export interface IRoutingErrors {
    [code: string]: {
        status?: number;
        message?: string;
    }
}