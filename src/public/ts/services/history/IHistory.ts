export interface InitParams {
    ctx: any,
    change: EventListener;
}

export interface HistoryParams {
    params?: {
        category?: string;
        subcategory?: string;
    };
    url: string;
}
