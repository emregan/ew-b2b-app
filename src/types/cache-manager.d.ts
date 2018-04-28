// Type definitions for cache-manager v1.2.0
// Project: https://github.com/BryanDonovan/node-cache-manager
// Definitions by: Simon Gausmann <https://github.com/GausSim>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface CachingConfig {
    ttl: number | Function;
}

interface ClusterOptions {
    maxRedirections?: number;
}

interface ClusterNode {
    port: number;
    host: string;
}

interface ClusterConfig {
    nodes: ClusterNode[];
    options?: ClusterOptions;
}

interface StoreConfig extends CachingConfig {
    store: string | object;
    max?: number;
    isCacheableValue?: (value: any) => boolean;
    host?: string;
    port?: number;
    auth_pass?: string;
    db?: number;
    clusterConfig?: ClusterConfig;
}

interface Cache {
    store: any;
    set<T>(key: string, value: T, options: CachingConfig, callback?: (error: any) => void): void;
    set<T>(key: string, value: T, ttl: number, callback?: (error: any) => void): void;

    wrap<T>(key: string, wrapper: (callback: (error: any, result: T) => void) => Promise<any>, options: CachingConfig, callback: (error: any, result: T) => void): Promise<any>;
    wrap<T>(key: string, wrapper: (callback: (error: any, result: T) => void) => Promise<any>, options: CachingConfig): Promise<any>;
    wrap<T>(key: string, wrapper: (callback: (error: any, result: T) => void) => Promise<any>, callback: (error: any, result: T) => void): Promise<any>;
    wrap<T>(key: string, wrapper: (callback: (error: any, result: T) => void) => Promise<any>): Promise<any>;

    get<T>(key: string, callback: (error: any, result: T) => void): void;

    del(key: string, callback?: (error: any) => void): void;
}



declare namespace cacheManager {
    function caching(IConfig: StoreConfig): Cache;
    function multiCaching(Caches: Cache[]): Cache;
}

export = cacheManager;
