import Config from './config';
import Events from './events';
import Storage from './storage';
import TPow from './types';
declare enum Platform {
    LinkedIn = "linkedin",
    PowPing = "powping",
    Twitter = "twitter",
    Twetch = "twetch",
    Facebook = "facebook"
}
export default class TonicPow {
    config: Config;
    storage: Storage;
    events: Events | undefined;
    widgets: Map<string, TPow.Widget | null>;
    options: TPow.TonicPowOptions | undefined;
    buttonViewsInitialized: boolean;
    shareButtons: Map<string, TPow.ShareButtonOptions>;
    nrOfButtons: number;
    constructor(options?: TPow.TonicPowOptions);
    setOreo: (name: string, value: string, days: number) => void;
    captureVisitorSession: (customSessionId?: string, customChallengeGuid?: string) => TPow.Capture;
    getVisitorSession: () => string | null;
    loadDivs: () => Promise<void>;
    private getDataAttributes;
    private initializeButton;
    shareButton: (id: string, options: TPow.ShareButtonOptions) => void;
    private initializeButtonViews;
    private static showPopup;
    shareOnPlatform: (shortlink: TPow.ShortLink, platform: Platform) => void;
    copyText: (text: string) => void;
    closePopup: () => void;
    private initializeBanner;
    load: () => Promise<void>;
}
declare global {
    interface Window {
        TonicPow: any;
    }
}
export {};
