import Config from './config'

const Events = {}

// Set the current session
let session = null;

// Remember when we started
const start = new Date().getTime()

// Sets the session and starts detecting interactions & bounce
Events.init = (tncpwSession) => {
  session = tncpwSession
  Events.detectInteraction()
  Events.detectBounce()
}

// Send event will send an event to TonicPow
Events.sendEvent = async (eventName, data) => {
  if (!session) {
    console.info('you must call init with a session before sending events');
    return;
  }
  // todo: obfuscate the url params (change to payload of JSON?)
  await fetch(
    `${Config.eventsUrl}/v1/events?v=${Config.version}&name=${eventName}&tncpw_session=${session}&data=${data}`,
    { method: 'get' },
  );
};

// Detects a bounce event
Events.detectBounce = () => {
  window.onbeforeunload = () => {
    // Calculate time on page
    Events.sendEvent('bounce', new Date().getTime() - start)
  }
}

// Detects a page interaction
Events.detectInteraction = () => {
  let interactionSent = false

  document.addEventListener('mousedown', async () => {
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction', 'mousedown');
        interactionSent = true;
      } catch (e) {
        console.error('failed to report interaction: mousedown', e);
      }
    }
  })

  document.addEventListener('scroll', async () => {
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction', 'scroll');
        interactionSent = true;
      } catch (e) {
        console.error('failed to report interaction: scroll', e);
      }
    }
  })

  document.addEventListener('keypress', async () => {
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction', 'keypress');
        interactionSent = true;
      } catch (e) {
        console.error('failed to report interaction: keypress', e);
      }
    }
  })

  document.addEventListener('click', async () => {
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction', 'click');
        interactionSent = true;
      } catch (e) {
        console.error('failed to report interaction: click', e);
      }
    }
  })
}

export default Events
