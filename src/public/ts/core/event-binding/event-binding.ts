import * as $ from 'jquery';

interface ConfigI{
    [key:string]: string|number;
    debounce:number;
    throttle:number;
}

export class EventsBinding {
    /**
    * events = {}
    * events.[eventName] = {}
    * events.[eventName].type = 'debounce|throttle'
    * events.[eventName].callback =  function(
    */
    private config:ConfigI ={
        debounce: 250,
        throttle: 100,
    };

    private event:EventTypesI = {
        resize: {
            throttle: [],
            debounce: []
        },
        scroll: {
            throttle: [],
            debounce: []
        },
    };

    private bindEvent(eventName:any, eventMethods:BindMethod){
        if (eventMethods.throttle.length > 0) {
            $(window).on(
                eventName,
                $.throttle(
                    (e)=>this.doEvents(e, eventName, 'throttle'),
                    this.config.throttle
                 )
            );
        }

        if (eventMethods.debounce.length > 0) {
            $(window).on(
                eventName,
                $.debounce(
                    (e)=>this.doEvents(e, eventName, 'debounce'),
                    this.config.debounce
                )
            );
        }
    }

    private doEvents(event:JQueryEventObject, eventName:string, eventType:string){
        this.event[eventName][eventType].forEach(
            (cb)=>this.callEvent(cb, event)
        )
    }

    private callEvent(cb, event:JQueryEventObject){
        cb(event);
    }

    public makeEventBind(name:string, type:string, callback:Function){
        this.event[name][type].push(callback);
    }

    public setConfig(name:string, value:number|string){
        this.config[name] = value
    }

    public attach(){
        $.each(this.event, this.bindEvent.bind(this));
    }
}
