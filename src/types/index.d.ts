declare module TonicPow {
  export const config: Config
  export const events: Events
  export const storage: Storage

  export const sessionId: string | null
  export const start: number

  export function setOreo(name: string, value: string, days: number): void
  export function captureVisitorSession(customSessionId: string): string | null
  export function getVisitorSession(): string | null
  export function loadDivs(): Promise<void>
  export function load(): void
  export function captureVisitorSession(): void

  export class Events {
    sessionId: string
    start: number
    detectBounce: () => void
    detectInteraction: () => void
    detectWidgetClick: () => void
    sendEvent: (eventName: string, data: string) => Promise<void>
  }

  export class Config {}

  export class Storage {
    removeStorage(name: string): void
    getStorage(key: string): string
    setStorage(key: string, value: string, expires: number | null): void
  }
}

export default TonicPow
