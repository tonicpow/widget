type Config = {
  apiUrl: string
  apiUrlLocal: string
  apiUrlStaging: string
  apiUrlProduction: string
  eventsUrl: string
  eventsUrlLocal: string
  eventsUrlStaging: string
  eventsUrlProduction: string
  customEnvironment: string
  environment: string
  environmentLocal: string
  environmentStaging: string
  environmentProduction: string
  environments: string[]
  maxSessionDays: number
  sessionName: string
  version: string
  widgetDivClass: string
  widgetId: string
  isEnvironmentValid: (env: string) => boolean
  setEnvironment: (env: string) => void
}

type Events = {
  init: (session: string) => void
  detectInteraction: () => void
  detectBounce: () => void
  sendEvent: (eventName: string, data: string) => Promise<void>
}

type CustomStorage = {
  removeStorage: (name: string) => boolean
  getStorage: (key: string) => string | null
  setStorage: (key: string, value: any, expires: number | null) => boolean
}
