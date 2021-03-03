import Config from './config';

const Events = {};

let session = null;

// Remember when we started
const start = new Date().getTime();

Events.init = (tncpwSession) => {
  session = tncpwSession;
  Events.detectInteraction();
  Events.detectBounce();
};

Events.sendEvent = async (eventName, data) => {
  if (!session) {
    console.error('You must call init with a session before sending events');
    return;
  }
  await fetch(`${Config.eventsUrl}/v1/widgets/event?eventName=${eventName}&session=${session}&data=${data}`, { method: 'get' });
};

Events.detectBounce = () => {
  window.onbeforeunload = () => {
    // Calculate time on page
    Events.sendEvent('bounce', new Date().getTime() - start);
  };
};

Events.detectInteraction = () => {
  let interactionSent = false;

  document.addEventListener('mousedown', async () => {
    if (!interactionSent) {
      try {
        interactionSent = true;
        await Events.sendEvent('interaction', 'mousedown');
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });

  document.addEventListener('scroll', async () => {
    if (!interactionSent) {
      try {
        interactionSent = true;
        await Events.sendEvent('interaction', 'scroll');
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });

  document.addEventListener('keypress', async () => {
    if (!interactionSent) {
      try {
        interactionSent = true;
        await Events.sendEvent('interaction', 'keypress');
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });

  document.addEventListener('click', async () => {
    if (!interactionSent) {
      try {
        interactionSent = true;
        await Events.sendEvent('interaction', 'click');
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });
};

export default Events;
