import Config from './config';
export default class Events {
    sessionId: string;
    start: number;
    interactionSent: boolean;
    config: Config;
    challengeGuid: string;
    constructor(sessionId: string | undefined, challengeGuid: string | undefined, config: Config);
    sendPing: () => void;
    detectWidgetClick: () => void;
    detectBounce: () => void;
    sendChallengeResponse: () => void;
    detectInteraction: () => void;
    sendEvent: (eventName: string, data: string) => Promise<void>;
}
