import Config from './config'

export default class Events {
  sessionId: string
  start: number
  interactionSent: boolean
  config: Config
  challengeGuid: string

  constructor(sessionId: string = '', challengeGuid: string = '', config: Config) {
    // Set the current session
    this.sessionId = sessionId
    this.config = config
    this.challengeGuid = challengeGuid

    this.interactionSent = false
    this.start = new Date().getTime()

    if (this.challengeGuid && this.challengeGuid.length > 0) {
      this.sendChallengeResponse()
    } else {
      // Remember when we started
      this.detectInteraction()
      this.detectBounce()
      this.detectWidgetClick()
      this.sendPing()
    }
  }

  // Sends a ping after 4 seconds
  sendPing = () => {
    setTimeout(() => {
      console.log('sending')
      this.sendEvent('ping', (new Date().getTime() - this.start).toString())
    }, 1000 * 4)
  }

  // Detects click on the widget
  detectWidgetClick = () => {
    document.addEventListener('click', async (e: Event) => {
      // Get the click target
      var target = (e || window.event).target as HTMLDivElement

      // Get the widget container
      let container = target?.parentElement?.parentElement

      // Send event only if widget was clicked
      if (container?.classList?.contains('tonicpow-widget')) {
        try {
          await this.sendEvent('click', container.getAttribute(this.config.widgetIdAttribute) || '')
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

  // Sends a challenge response
  sendChallengeResponse = () => {
    try {
      this.sendEvent('challenge', this.challengeGuid)
    } catch (e) {
      console.error('Failed to send challenge response', e)
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
    if (!this.sessionId && !this.challengeGuid) {
      console.info('you must call init with a session before sending events')
      return
    }

    // Get origin
    let location = window.location.href

    // Package payload
    let payload = {
      v: this.config.version,
      name: eventName,
      location,
      data,
    } as any

    if (this.sessionId) {
      payload.tncpw_session = this.sessionId
    }

    await fetch(`${this.config.eventsUrl}/v1/events?d=${btoa(JSON.stringify(payload))}`, {
      method: 'get',
    })
  }
}
