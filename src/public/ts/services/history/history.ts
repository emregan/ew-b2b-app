import { InitParams, HistoryParams } from './IHistory';

export default class History {

    constructor(params: InitParams) {
        window.addEventListener('popstate', params.change.bind(params.ctx));
    }

    public push(params: HistoryParams, title: string, url: string) {
        window.history.pushState(params, title, url);
    }

}
