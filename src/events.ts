import Config from './config'

export default class Events {
  sessionId: string
  start: number
  interactionSent: boolean

  constructor(sessionId: string) {
    // Set the current session
    this.sessionId = sessionId

    this.interactionSent = false

    // Remember when we started
    this.start = new Date().getTime()
    this.detectInteraction()
    this.detectBounce()
    this.detectWidgetClick()
  }

  // Detects click on the widget
  detectWidgetClick = () => {
    document.addEventListener('click', async (e: Event) => {
      e = e || window.event
      var target = (e.target || e.srcElement) as HTMLDivElement
      // Get container from the clicked element
      let container = target?.parentElement?.parentElement
      // Send only if widget image was clicked
      if (container?.classList?.contains('tonicpow-widget')) {
        try {
          // Keepo this above send to prevent sending mousedown AND click on initial interaction
          this.interactionSent = true
          await this.sendEvent('interaction', 'click')
        } catch (e) {
          console.error('failed to report interaction: click', e)
        }
      }
    })
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
    document.addEventListener('mousedown', async () => {
      if (!this.interactionSent) {
        try {
          await this.sendEvent('interaction', 'mousedown')
          this.interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: mousedown', e)
        }
      }
    })

    document.addEventListener('scroll', async () => {
      if (!this.interactionSent) {
        try {
          await this.sendEvent('interaction', 'scroll')
          this.interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: scroll', e)
        }
      }
    })

    document.addEventListener('keypress', async () => {
      if (!this.interactionSent) {
        try {
          await this.sendEvent('interaction', 'keypress')
          this.interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: keypress', e)
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
