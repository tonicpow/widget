const { assert, expect } = require('chai')

require('../dist/tonicpow')
// import '../dist/tonicpow'

describe('Running TypeScript tests in ts-node runtime without compilation', () => {
  describe('paths app module', () => {
    // const window.TonicPow = new (window as any).TonicPow()
    it('provides adder that adds two numbers', () => {
      return expect(1 === 1, 'wow')
    })
  })
})

describe('TonicPow.js loaded', () => {
  it('TonicPow should be set', () => {
    expect(typeof window.TonicPow === 'object', 'TonicPow is not object')
  })

  it('TonicPow.Storage should be set', () => {
    assert(typeof window.TonicPow.storage === 'object', 'Storage is not object')
  })

  it('TonicPow.Config should be set', () => {
    assert(typeof window.TonicPow.config === 'object', 'Config is not object')
  })

  // todo: mock a fetch cmd to get a widget and test updating div->wfidget
})

describe('Testing config functions', () => {
  it('testing TonicPow.Config.isEnvironmentValid', () => {
    assert(
      window.TonicPow.config.isEnvironmentValid('staging'),
      'Environment should be valid: staging'
    )
    assert(
      window.TonicPow.config.isEnvironmentValid('production'),
      'Environment should be valid: production'
    )
    assert(
      !window.TonicPow.config.isEnvironmentValid('unknown'),
      'Environment should NOT be valid: unknown'
    )
  })

  it('testing TonicPow.config.setEnvironment - staging', () => {
    window.TonicPow.config.setEnvironment('staging')
    assert(
      window.TonicPow.config.environment === window.TonicPow.config.environmentStaging,
      `Environment should be valid: staging, got: ${window.TonicPow.environment}`
    )
    assert(
      window.TonicPow.config.apiUrl === window.TonicPow.config.apiUrlStaging,
      `API url should be: staging, got: ${window.TonicPow.apiUrl}`
    )
  })

  it('testing TonicPow.config.setEnvironment - local', () => {
    window.TonicPow.config.setEnvironment('local')
    assert(
      window.TonicPow.config.environment === window.TonicPow.config.environmentLocal,
      'Environment should be valid: local'
    )
    assert(
      window.TonicPow.config.apiUrl === window.TonicPow.config.apiUrlLocal,
      'API url should be: local'
    )
  })

  it('testing TonicPow.config.setEnvironment - production', () => {
    window.TonicPow.config.setEnvironment('production')
    assert(
      window.TonicPow.config.environment === window.TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      window.TonicPow.config.apiUrl === window.TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
  })

  it('testing TonicPow.config.setEnvironment - failures', () => {
    window.TonicPow.config.setEnvironment('')
    assert(
      window.TonicPow.config.environment === window.TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      window.TonicPow.config.apiUrl === window.TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
    window.TonicPow.config.setEnvironment('unknown')

    assert(
      window.TonicPow.config.environment === window.TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      window.TonicPow.config.apiUrl === window.TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
  })
})
