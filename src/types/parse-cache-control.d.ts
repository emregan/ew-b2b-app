interface CacheControl {
    "max-age"?: number;
    "max-stale"?: string | boolean;
    "min-fresh"?: string | boolean;
    "no-cache "?: string | boolean;
    "no-store"?: string | boolean;
    "no-transform"?: string | boolean;
    "only-if-cached"?: string | boolean;
    "must-revalidate"?: string | boolean;
    "no-cache"?: string | boolean;
    "public"?: string | boolean;
    "private"?: string | boolean;
    "proxy-revalidate"?: string | boolean;
    "s-maxage"?: string | boolean;
    "immutable"?: string | boolean;
    "stale-while-revalidate"?: string | boolean;
    "stale-if-error"?: string | boolean;
}

declare function parseCacheControl(field: string): CacheControl;

export = parseCacheControl;