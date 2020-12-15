const environmentProduction = 'production'
const environmentStaging = 'staging'
const environmentLocal = 'local'

const Config = {
  apiUrl: 'https://api.tonicpow.com',
  apiUrlLocal: 'http://localhost:3000',
  apiUrlStaging: 'https://api.staging.tonicpow.com',
  apiUrlProduction: 'https://api.tonicpow.com',
  customEnvironment: 'data-environment',
  environment: environmentProduction,
  environmentLocal: environmentLocal,
  environmentProduction: environmentProduction,
  environments: [environmentProduction, environmentStaging, environmentLocal],
  environmentStaging: environmentStaging,
  maxSessionDays: 60,
  sessionName: 'tncpw_session',
  version: 'v0.0.1',
  widgetDivClass: 'tonicpow-widget',
  widgetId: 'data-widget-id'
}

// isEnvironmentValid will check if the given environment is valid
Config.isEnvironmentValid = (environment) => {
  return Config.environments.indexOf(environment) >= 0
}

// setEnvironment will set the environment
Config.setEnvironment = (environment) => {
  // No environment set? use the default
  if (!environment) {
    return
  }

  // Not a valid environment?
  if (!Config.isEnvironmentValid(environment)) {
    return
  }

  // Set the environment
  Config.environment = environment

  // Set the API url
  if (environment === Config.environmentStaging) {
    Config.apiUrl = Config.apiUrlStaging
  } else if (environment === Config.environmentLocal) {
    Config.apiUrl = Config.apiUrlLocal
  } else if (environment === Config.environmentProduction) {
    Config.apiUrl = Config.apiUrlProduction
  }
}

export default Config
