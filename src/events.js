// Remember when we started
const start = new Date().getTime();

const Events = {};
let session = null;

Events.init = (tncpwSession) => {
  console.log('init', tncpwSession);
  session = tncpwSession;
  Events.detectInteraction();
  Events.detectBounce();
};

Events.sendEvent = async (eventName, data) => {
  if (!session) {
    console.error('You must call init with a session before sending events');
  }
  await fetch(`http://localhost:3002/v1/widgets/event?eventName=${eventName}&session=${session}&data=${data}`, { method: 'get' });
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
    console.log('mouse down', interactionSent);
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction');
        interactionSent = true;
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });

  document.addEventListener('scroll', async () => {
    console.log('scroll', interactionSent);
    if (!interactionSent) {
      try {
        await Events.sendEvent('interaction');
        interactionSent = true;
      } catch (e) {
        console.error('Failed to report interaction', e);
      }
    }
  });

  // $(this).mousemove(function () {
  //     reset();
  // });

  // $(this).scroll(function () {
  //     reset();
  // });

  // $(this).mouseup(function () {
  //     reset();
  // });

  // $(this).click(function () {
  //     reset();
  // });

// $(this).keypress(function () {
//     reset();
// });
};

export default Events;
