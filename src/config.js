const environmentLocal = 'local';
const environmentStaging = 'staging';
const environmentProduction = 'production';

const Config = {
  apiUrl: 'https://api.tonicpow.com',
  apiUrlLocal: 'http://localhost:3000',
  apiUrlStaging: 'https://api.staging.tonicpow.com',
  apiUrlProduction: 'https://api.tonicpow.com',
  customEnvironment: 'data-environment',
  environment: environmentProduction,
  environmentLocal,
  environmentStaging,
  environmentProduction,
  environments: [environmentLocal, environmentStaging, environmentProduction],
  maxSessionDays: 60,
  sessionName: 'tncpw_session',
  version: 'v0.0.4',
  widgetDivClass: 'tonicpow-widget',
  widgetId: 'data-widget-id',
};

// isEnvironmentValid will check if the given environment is valid
Config.isEnvironmentValid = (environment) => Config.environments.includes(environment);

// setEnvironment will set the environment
Config.setEnvironment = (environment) => {
  // No environment set? use the default
  if (!environment) {
    return;
  }

  // Not a valid environment?
  if (!Config.isEnvironmentValid(environment)) {
    return;
  }

  // Set the environment
  Config.environment = environment;

  // Set the API url
  if (environment === Config.environmentStaging) {
    Config.apiUrl = Config.apiUrlStaging;
  } else if (environment === Config.environmentLocal) {
    Config.apiUrl = Config.apiUrlLocal;
  } else if (environment === Config.environmentProduction) {
    Config.apiUrl = Config.apiUrlProduction;
  }
};

export default Config;
