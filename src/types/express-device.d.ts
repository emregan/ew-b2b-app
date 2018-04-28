///<reference types="express"/>

declare namespace Express {
   export interface Request {
      device?: any
   }
}


interface CaptureConfigsI{
  emptyUserAgentDeviceType?:  string;
  unknownUserAgentDeviceType?:  string;
  botUserAgentDeviceType?:  string;
  carUserAgentDeviceType?:  string;
  parseUserAgent?:  string;
}
export function capture(settings?: CaptureConfigsI): any;
export function enableDeviceHelpers(app: any): any;
