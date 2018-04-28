export class RollbarInit{
    private _rollbarConfig = {
        accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
            environment: "production"
        }
    };

    constructor(){
        this.initRollbar();
    }

    private initRollbar():void {

    }
}
