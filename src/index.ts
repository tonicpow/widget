import Config from './config'
import Events from './events'
import Storage from './storage'

type TonicPow = {
  Config: Config
  Events: Events
  Storage: CustomStorage
  setOreo: (name: string, value: string, days: number) => void
  captureVisitorSession: (customSessionId?: string) => void
  getVisitorSession: () => string | null
  loadDivs: () => Promise<void>
  load: () => void
}
// Start the TonicPow service and load modules
const tonicPow: TonicPow = {
  Config,
  Events,
  Storage,
  // setOreo for creating new oreos
  setOreo: (name: string, value: string, days: number) => {
    const date = new Date()
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`
  },

  // captureVisitorSession will capture the session and store it
  // Builds a cookie so it's sent on requests automatically
  // Stores in local storage for easy access from the application
  captureVisitorSession: (customSessionId = '') => {
    let sessionId: string | null = customSessionId

    if ((!customSessionId || !customSessionId.length) && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      sessionId = urlParams.get(Config.sessionName)
    }
    if (sessionId && sessionId.length > 0) {
      tonicPow.setOreo(Config.sessionName, sessionId, Config.maxSessionDays)
      tonicPow.Storage.setStorage(
        Config.sessionName,
        sessionId,
        24 * 60 * 60 * Config.maxSessionDays
      )
    }
  },
  // getVisitorSession will get the session if it exists
  getVisitorSession: () => tonicPow.Storage.getStorage(Config.sessionName),

  // loadDivs replaces each TonicPow div with a corresponding embed widget
  loadDivs: async () => {
    // Get all divs
    const tonicDivs = document.getElementsByClassName(Config.widgetDivClass)

    // Loop all divs that we found
    for (let i = tonicDivs.length - 1; i >= 0; i--) {
      // Set the div
      const tonicDiv = tonicDivs[i]

      // Get the widget id
      const widgetId = tonicDiv.getAttribute(Config.widgetId)
      if (!widgetId) {
        console.log(`${widgetId} not found`)
        continue
      }

      // Get the custom environment (switching away from default: production)
      const customEnvironment = tonicDiv.getAttribute(Config.customEnvironment)
      if (!customEnvironment) {
        console.warn('Custom environment is invalid. Expecting a string, found', customEnvironment)
        continue
      }
      Config.setEnvironment(customEnvironment)

      // Fire the request to load the widget data
      const promise = await fetch(
        `${Config.apiUrl}/v1/widgets/display/${widgetId}?provider=embed-${Config.version}`
      )
      const response = await promise.json()

      // Set URI encoded title
      const campaignTitle = encodeURIComponent(response.title)

      // Set the HTML
      tonicDiv.innerHTML = `
    <a href="${response.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${widgetId}&utm_content=${campaignTitle}">
      <img src="${response.image_url}" 
      width="${response.width}" 
      height="${response.height}" 
      alt="${response.title}" />
    </a>`

      // Set additional information
      tonicDiv.setAttribute('data-width', response.width)
      tonicDiv.setAttribute('data-height', response.height)
    }
  },

  // Load the TonicPow script(s) and default settings
  load: () => {
    // We only work in a browser
    if (typeof window === 'undefined') {
      console.error('TonicPow embed only works in the browser')
      return
    }

    // Load all tonics found on the page (if we have div)
    const tonicDivs = document.getElementsByClassName(Config.widgetDivClass)
    if (tonicDivs && tonicDivs.length > 0) {
      tonicPow.loadDivs().then(() => {
        console.log('TonicPow widget(s) loaded!')
      })
    }

    // Process visitor token
    tonicPow.captureVisitorSession()

    // Capture events if we have a session
    const session = tonicPow.getVisitorSession()
    if (session) {
      Events.init(session)
    }
  },
}

// Load the TonicPow widget
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // This loads if the <script> is dynamically injected into the page
  tonicPow.load()
} else {
  // This loads if the <script> is hardcoded in the html page in the <head>
  document.addEventListener('DOMContentLoaded', () => {
    tonicPow.load()
  })
}

// Store on the window (safely)
if (typeof window !== 'undefined') {
  ;(window as any).TonicPow = tonicPow
}
