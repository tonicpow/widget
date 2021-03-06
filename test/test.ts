const { assert, expect } = require('chai')

require('../dist/tonicpow')

describe('Running TypeScript tests in ts-node runtime without compilation', () => {
  describe('paths app module', () => {
    it('provides adder that adds two numbers', () => {
      return expect(1 === 1, 'wow')
    })
  })
})

describe('TonicPow.js loaded', () => {
  it('TonicPow should be set', () => {
    expect(typeof (window as any).TonicPow === 'object', 'TonicPow is not object')
  })

  it('TonicPow.Storage should be set', () => {
    assert(typeof (window as any).TonicPow.storage === 'object', 'Storage is not object')
  })

  it('TonicPow.Config should be set', () => {
    assert(typeof (window as any).TonicPow.config === 'object', 'Config is not object')
  })

  // todo: mock a fetch cmd to get a widget and test updating div->widget
})

describe('Testing config functions', () => {
  it('testing TonicPow.Config.isEnvironmentValid', () => {
    assert(
      (window as any).TonicPow.config.isEnvironmentValid('staging'),
      'Environment should be valid: staging'
    )
    assert(
      (window as any).TonicPow.config.isEnvironmentValid('production'),
      'Environment should be valid: production'
    )
    assert(
      !(window as any).TonicPow.config.isEnvironmentValid('unknown'),
      'Environment should NOT be valid: unknown'
    )
  })

  it('testing TonicPow.config.setEnvironment - staging', () => {
    ;(window as any).TonicPow.config.setEnvironment('staging')
    assert(
      (window as any).TonicPow.config.environment ===
        (window as any).TonicPow.config.environmentStaging,
      `Environment should be valid: staging, got: ${(window as any).TonicPow.environment}`
    )
    assert(
      (window as any).TonicPow.config.apiUrl === (window as any).TonicPow.config.apiUrlStaging,
      `API url should be: staging, got: ${(window as any).TonicPow.apiUrl}`
    )
  })

  it('testing TonicPow.config.setEnvironment - local', () => {
    ;(window as any).TonicPow.config.setEnvironment('local')
    assert(
      (window as any).TonicPow.config.environment ===
        (window as any).TonicPow.config.environmentLocal,
      'Environment should be valid: local'
    )
    assert(
      (window as any).TonicPow.config.apiUrl === (window as any).TonicPow.config.apiUrlLocal,
      'API url should be: local'
    )
  })

  it('testing TonicPow.config.setEnvironment - production', () => {
    ;(window as any).TonicPow.config.setEnvironment('production')
    assert(
      (window as any).TonicPow.config.environment ===
        (window as any).TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      (window as any).TonicPow.config.apiUrl === (window as any).TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
  })

  it('testing TonicPow.config.setEnvironment - failures', () => {
    ;(window as any).TonicPow.config.setEnvironment('')
    assert(
      (window as any).TonicPow.config.environment ===
        (window as any).TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      (window as any).TonicPow.config.apiUrl === (window as any).TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
    ;(window as any).TonicPow.config.setEnvironment('unknown')

    assert(
      (window as any).TonicPow.config.environment ===
        (window as any).TonicPow.config.environmentProduction,
      'Environment should be valid: production'
    )
    assert(
      (window as any).TonicPow.config.apiUrl === (window as any).TonicPow.config.apiUrlProduction,
      'API url should be: production'
    )
  })
})
