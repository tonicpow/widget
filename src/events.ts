import Config from './config'

export default class Events {
  sessionId: string
  start: number

  constructor(sessionId: string) {
    // Set the current session
    this.sessionId = sessionId

    // Remember when we started
    this.start = new Date().getTime()
    this.detectInteraction()
    this.detectBounce()
  }

  // Detects a bounce event
  detectBounce = () => {
    window.onbeforeunload = () => {
      // Calculate time on page
      this.sendEvent('bounce', (new Date().getTime() - this.start).toString())
    }
  }

  // Detects a page interaction
  detectInteraction = () => {
    let interactionSent = false

    document.addEventListener('mousedown', async () => {
      if (!interactionSent) {
        try {
          await this.sendEvent('interaction', 'mousedown')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: mousedown', e)
        }
      }
    })

    document.addEventListener('scroll', async () => {
      if (!interactionSent) {
        try {
          await this.sendEvent('interaction', 'scroll')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: scroll', e)
        }
      }
    })

    document.addEventListener('keypress', async () => {
      if (!interactionSent) {
        try {
          await this.sendEvent('interaction', 'keypress')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: keypress', e)
        }
      }
    })

    document.addEventListener('click', async () => {
      if (!interactionSent) {
        try {
          await this.sendEvent('interaction', 'click')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: click', e)
        }
      }
    })
  }

  // Send event will send an event to TonicPow
  sendEvent = async (eventName: string, data: string) => {
    if (!this.sessionId) {
      console.info('you must call init with a session before sending events')
      return
    }

    // Get config
    let config = new Config()

    // todo: obfuscate the url params (change to payload of JSON?)
    await fetch(
      `${config.eventsUrl}/v1/events?v=${config.version}&name=${eventName}&tncpw_session=${this.sessionId}&data=${data}`,
      { method: 'get' }
    )
  }
}
