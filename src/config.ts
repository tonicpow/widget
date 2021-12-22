const environmentLocal = 'local'
const environmentStaging = 'staging'
const environmentProduction = 'production'

const config = {
  apiUrl: 'https://api.tonicpow.com',
  apiUrlLocal: 'http://localhost:3000',
  apiUrlStaging: 'https://api.staging.tonicpow.com',
  apiUrlProduction: 'https://api.tonicpow.com',
  eventsUrl: 'https://events.tonicpow.com',
  eventsUrlLocal: 'http://localhost:3002',
  eventsUrlStaging: 'https://events.staging.tonicpow.com',
  eventsUrlProduction: 'https://events.tonicpow.com',
  customEnvironment: 'data-environment',
  environment: environmentProduction,
  environmentLocal,
  environmentStaging,
  environmentProduction,
  environments: [environmentLocal, environmentStaging, environmentProduction],
  maxSessionDays: 60,
  sessionName: 'tncpw_session',
  version: 'v0.0.7',
  widgetDivClass: 'tonicpow-widget',
  widgetId: 'data-widget-id',
} as Config

// isEnvironmentValid will check if the given environment is valid
config.isEnvironmentValid = (environment: string) => config.environments.includes(environment)

// setEnvironment will set the environment
config.setEnvironment = (environment: string) => {
  // No environment set? use the default
  if (!environment) {
    return
  }

  // Not a valid environment?
  if (!config.isEnvironmentValid(environment)) {
    return
  }

  // Set the environment
  config.environment = environment

  // Set the API url
  if (environment === config.environmentStaging) {
    config.apiUrl = config.apiUrlStaging
    config.eventsUrl = config.eventsUrlStaging
  } else if (environment === config.environmentLocal) {
    config.apiUrl = config.apiUrlLocal
    config.eventsUrl = config.eventsUrlLocal
  } else if (environment === config.environmentProduction) {
    config.apiUrl = config.apiUrlProduction
    config.eventsUrl = config.eventsUrlProduction
  }
}

export default config
