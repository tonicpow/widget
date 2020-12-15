// let expect = chai.expect;
let assert = chai.assert;

describe('TonicPow.js loaded', function() {

  it('window.TonicPow should be set', function() {
    assert(typeof window.TonicPow === 'object', 'TonicPow is not object')
  })

  it('window.TonicPow.Storage should be set', function() {
    assert(typeof window.TonicPow.Storage === 'object', 'Storage is not object')
  })

  it('window.TonicPow.Config should be set', function() {
    assert(typeof window.TonicPow.Config === 'object', 'Config is not object')
  })

  // todo: mock a fetch cmd to get a widget and test updating div->widget
})

describe('Testing config functions', function() {
  it('testing window.TonicPow.Config.isEnvironmentValid', function() {
    assert(
      window.TonicPow.Config.isEnvironmentValid('staging'),
      'Environment should be valid: staging',
    )
    assert(
      window.TonicPow.Config.isEnvironmentValid('production'),
      'Environment should be valid: production',
    )
    assert(
      !window.TonicPow.Config.isEnvironmentValid('unknown'),
      'Environment should NOT be valid: unknown',
    )
  })

  it('testing window.TonicPow.Config.setEnvironment - staging', function() {
    window.TonicPow.Config.setEnvironment('staging')
    assert(
      window.TonicPow.Config.environment === window.TonicPow.Config.environmentStaging,
      'Environment should be valid: staging, got: '+window.TonicPow.environment,
    )
    assert(
      window.TonicPow.Config.apiUrl === window.TonicPow.Config.apiUrlStaging,
      'API url should be: staging, got: '+window.TonicPow.apiUrl,
    )
  })

  it('testing window.TonicPow.Config.setEnvironment - local', function() {
    window.TonicPow.Config.setEnvironment('local')
    assert(
      window.TonicPow.Config.environment === window.TonicPow.Config.environmentLocal,
      'Environment should be valid: local',
    )
    assert(
      window.TonicPow.Config.apiUrl === window.TonicPow.Config.apiUrlLocal,
      'API url should be: local',
    )
  })

  it('testing window.TonicPow.Config.setEnvironment - production', function() {
    window.TonicPow.Config.setEnvironment('production')
    assert(
      window.TonicPow.Config.environment === window.TonicPow.Config.environmentProduction,
      'Environment should be valid: production',
    )
    assert(
      window.TonicPow.Config.apiUrl === window.TonicPow.Config.apiUrlProduction,
      'API url should be: production',
    )
  })

  it('testing window.TonicPow.Config.setEnvironment - failures', function() {
    window.TonicPow.Config.setEnvironment('')
    assert(
      window.TonicPow.Config.environment === window.TonicPow.Config.environmentProduction,
      'Environment should be valid: production',
    )
    assert(
      window.TonicPow.Config.apiUrl === window.TonicPow.Config.apiUrlProduction,
      'API url should be: production',
    )

    window.TonicPow.Config.setEnvironment('unknown')
    assert(
      window.TonicPow.Config.environment === window.TonicPow.Config.environmentProduction,
      'Environment should be valid: production',
    )
    assert(
      window.TonicPow.Config.apiUrl === window.TonicPow.Config.apiUrlProduction,
      'API url should be: production',
    )
  })
})
