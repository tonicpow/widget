import Config from './config'

// Set the current session
let session: string | null = null

// Remember when we started
const start = new Date().getTime()

const events: Events = {
  // Sets the session and starts detecting interactions & bounce
  init: (tncpwSession) => {
    session = tncpwSession
    events.detectInteraction()
    events.detectBounce()
  },
  // Send event will send an event to TonicPow
  sendEvent: async (eventName, data) => {
    if (!session) {
      console.info('you must call init with a session before sending events')
      return
    }
    // todo: obfuscate the url params (change to payload of JSON?)
    await fetch(
      `${Config.eventsUrl}/v1/events?v=${Config.version}&name=${eventName}&tncpw_session=${session}&data=${data}`,
      { method: 'get' }
    )
  },
  // Detects a bounce event
  detectBounce: () => {
    window.onbeforeunload = () => {
      // Calculate time on page
      events.sendEvent('bounce', String(new Date().getTime() - start))
    }
  },
  // Detects a page interaction
  detectInteraction: () => {
    let interactionSent = false

    document.addEventListener('mousedown', async () => {
      if (!interactionSent) {
        try {
          await events.sendEvent('interaction', 'mousedown')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: mousedown', e)
        }
      }
    })

    document.addEventListener('scroll', async () => {
      if (!interactionSent) {
        try {
          await events.sendEvent('interaction', 'scroll')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: scroll', e)
        }
      }
    })

    document.addEventListener('keypress', async () => {
      if (!interactionSent) {
        try {
          await events.sendEvent('interaction', 'keypress')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: keypress', e)
        }
      }
    })

    document.addEventListener('click', async () => {
      if (!interactionSent) {
        try {
          await events.sendEvent('interaction', 'click')
          interactionSent = true
        } catch (e) {
          console.error('failed to report interaction: click', e)
        }
      }
    })
  },
}

export default events
