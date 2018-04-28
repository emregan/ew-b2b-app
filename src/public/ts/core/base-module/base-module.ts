abstract class BaseModule {
    public debounceResize (e?:JQueryEventObject):any {
        return false;
    };
    public debounceScroll (e?:JQueryEventObject):any {
        return false;
    };
    public throttleResize (e?:JQueryEventObject):any {
        return false;
    };
    public throttleScroll (e?:JQueryEventObject):any {
        return false;
    };

    constructor(){}
}

export default BaseModule;
