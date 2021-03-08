import TonicPow from 'types'
import Config from './config'
export default class Events {
  sessionId: string
  start: number
  interactionSent: boolean
  config: Config
  challengeGuid: string

  constructor(sessionId = '', challengeGuid = '', config: Config) {
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
  sendPing = (): void => {
    setTimeout(() => {
      console.log('sending')
      this.sendEvent('ping', (new Date().getTime() - this.start).toString())
    }, 1000 * 4)
  }

  // Detects click on the widget
  detectWidgetClick = (): void => {
    document.addEventListener('click', async (e: Event) => {
      // Get the click target
      const target = (e || window.event).target as HTMLDivElement

      // Get the widget container
      const container = target?.parentElement?.parentElement

      // Send event only if widget was clicked
      if (container?.classList?.contains('tonicpow-widget')) {
        try {
          await this.sendEvent(
            'widget_click',
            container.getAttribute(this.config.widgetIdAttribute) || ''
          )
        } catch (e) {
          console.error('failed to report interaction: widget_click', e)
        }
      }
    })
  }

  // Detects a bounce event
  detectBounce = (): void => {
    window.onbeforeunload = () => {
      // Calculate time on page
      this.sendEvent('bounce', (new Date().getTime() - this.start).toString())
    }
  }

  // Sends a challenge response
  sendChallengeResponse = (): void => {
    try {
      this.sendEvent('challenge', this.challengeGuid)
    } catch (e) {
      console.error('Failed to send challenge response', e)
    }
  }

  // Detects a page interaction
  detectInteraction = (): void => {
    document.addEventListener('mousedown', async () => {
      if (!this.interactionSent) {
        try {
          this.interactionSent = true
          await this.sendEvent('interaction', 'mousedown')
        } catch (e) {
          console.error('failed to report interaction: mousedown', e)
        }
      }
    })

    document.addEventListener('scroll', async () => {
      if (!this.interactionSent) {
        try {
          this.interactionSent = true
          await this.sendEvent('interaction', 'scroll')
        } catch (e) {
          console.error('failed to report interaction: scroll', e)
        }
      }
    })

    document.addEventListener('keypress', async () => {
      if (!this.interactionSent) {
        try {
          this.interactionSent = true
          await this.sendEvent('interaction', 'keypress')
        } catch (e) {
          console.error('failed to report interaction: keypress', e)
        }
      }
    })
  }

  // Send event will send an event to TonicPow
  sendEvent = async (eventName: string, data: string): Promise<void> => {
    if (!this.sessionId && !this.challengeGuid) {
      console.info('you must call init with a session before sending events')
      return
    }

    // Get origin
    const location = window.location.href

    // Package payload
    const payload = {
      v: this.config.version,
      name: eventName,
      location,
      data,
    } as TonicPow.Payload

    if (this.sessionId) {
      payload.tncpw_session = this.sessionId
    }

    await fetch(`${this.config.eventsUrl}/v1/events?d=${btoa(JSON.stringify(payload))}`, {
      method: 'get',
    })
  }
}
