export default class Config {
  environmentLocal: string
  environmentStaging: string
  environmentProduction: string
  apiUrl: string
  apiUrlLocal: string
  apiUrlStaging: string
  apiUrlProduction: string
  eventsUrl: string
  eventsUrlLocal: string
  eventsUrlStaging: string
  eventsUrlProduction: string
  customEnvironmentAttribute: string
  environment: string
  environments: string[]
  maxSessionDays: number
  challengeParameterName: string
  sessionParameterName: string
  version: string
  widgetDivClass: string
  widgetIdAttribute: string
  hostUrlLocal: string
  hostUrlStaging: string
  hostUrlProduction: string
  hostUrl: string

  constructor() {
    this.environmentLocal = 'local'
    this.environmentStaging = 'staging'
    this.environmentProduction = 'production'

    this.apiUrl = 'https://api.tonicpow.com'
    this.apiUrlLocal = 'http://localhost:3000'
    this.apiUrlStaging = 'https://api.staging.tonicpow.com'
    this.apiUrlProduction = 'https://api.tonicpow.com'
    this.eventsUrl = 'https://events.tonicpow.com'
    this.eventsUrlLocal = 'http://localhost:3002'
    this.eventsUrlStaging = 'https://events.staging.tonicpow.com'
    this.eventsUrlProduction = 'https://events.tonicpow.com'
    this.hostUrl = 'http://tonicpow.com'
    this.hostUrlLocal = 'http://localhost:3000'
    this.hostUrlStaging = 'https://web.staging.tonicpow.com'
    this.hostUrlProduction = 'https://tonicpow.com'
    this.customEnvironmentAttribute = 'data-environment'
    this.environment = ''
    this.environments = [this.environmentLocal, this.environmentStaging, this.environmentProduction]
    this.maxSessionDays = 60
    this.sessionParameterName = 'tncpw_session'
    this.challengeParameterName = 'tncpw_challenge'
    this.version = 'v0.0.10'
    this.widgetDivClass = 'tonicpow-widget'
    this.widgetIdAttribute = 'data-widget-id'
  }

  // isEnvironmentValid will check if the given environment is valid
  isEnvironmentValid = (environment: string): boolean => this.environments.includes(environment)

  // setEnvironment will set the environment
  setEnvironment = (environment: string): void => {
    // No environment set? use the default
    if (!environment) {
      return
    }

    // Not a valid environment?
    if (!this.isEnvironmentValid(environment)) {
      return
    }

    // Set the environment
    this.environment = environment

    // Set the API url
    if (environment === this.environmentStaging) {
      this.apiUrl = this.apiUrlStaging
      this.eventsUrl = this.eventsUrlStaging
      this.hostUrl = this.hostUrlStaging
    } else if (environment === this.environmentLocal) {
      this.apiUrl = this.apiUrlLocal
      this.eventsUrl = this.eventsUrlLocal
      this.hostUrl = this.hostUrlLocal
    } else if (environment === this.environmentProduction) {
      this.apiUrl = this.apiUrlProduction
      this.eventsUrl = this.eventsUrlProduction
      this.hostUrl = this.hostUrlProduction
    }
  }
}
