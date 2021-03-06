import Config from './config'
import Events from './events'
import Storage from './storage'
import Widget from './types'
export default class TonicPow {
  config: Config
  storage: Storage
  events: Events | undefined
  widgets: Map<String, typeof Widget | null>

  constructor() {
    // Set namespaces
    this.config = new Config()
    this.storage = new Storage()
    this.widgets = new Map<String, typeof Widget>()

    // Start the TonicPow service and load modules

    // Load the TonicPow widget when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // This loads if the <script> is dynamically injected into the page
      this.load()
      this.registerEvents()
    } else {
      // This loads if the <script> is hardcoded in the html page in the <head>
      document.addEventListener('DOMContentLoaded', () => {
        this.load()
        this.registerEvents()
      })
    }
  }

  // registerEvents -Registers event listeners. Runs only once
  registerEvents = () => {
    if (!this.events) {
      // Register events if we have a valid session
      let session = this.getVisitorSession()
      // TODO: Validate session here
      if (session && session.length) {
        this.events = new Events(session)
      }
    }
  }

  // setOreo for creating new oreos
  setOreo = (name: string, value: string, days: number) => {
    const date = new Date()
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`
  }

  // captureVisitorSession will capture the session and store it
  // Builds a cookie so it's sent on requests automatically
  // Stores in local storage for easy access from the application
  captureVisitorSession = (customSessionId: string = '') => {
    let sessionId = customSessionId

    if ((!customSessionId || !customSessionId.length) && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      sessionId = urlParams.get(this.config.sessionName) || ''
    }
    if (sessionId && sessionId.length > 0) {
      this.setOreo(this.config.sessionName, sessionId, this.config.maxSessionDays)
      this.storage.setStorage(
        this.config.sessionName,
        sessionId,
        24 * 60 * 60 * this.config.maxSessionDays
      )
      return sessionId
    }
    return null
  }

  // getVisitorSession will get the session if it exists
  getVisitorSession = () => this.storage.getStorage(this.config.sessionName)

  // loadDivs replaces each TonicPow div with a corresponding embed widget
  loadDivs = async () => {
    // Get all divs
    const tonicDivs = document.getElementsByClassName(this.config.widgetDivClass)

    // Loop all divs that we found
    for (let i = tonicDivs.length - 1; i >= 0; i--) {
      // Set the div
      const tonicDiv = tonicDivs[i] as HTMLDivElement

      // Not sure why this is needed but encountered this in prod 3/5/2021 - luke
      if (!tonicDiv) {
        continue
      }

      // Get the widget id
      const widgetId = tonicDiv.getAttribute(this.config.widgetId)
      if (!widgetId) {
        console.log(`${widgetId} not found`)
        continue
      }

      // Get the custom environment (switching away from default: production)
      const customEnvironment = tonicDiv.getAttribute(this.config.customEnvironment)
      this.config.setEnvironment(customEnvironment || 'production')

      // Add to widgets map
      this.widgets.set(widgetId, null)

      try {
        // Fire the request to load the widget data
        const promise = await fetch(
          `${this.config.apiUrl}/v1/widgets/display/${widgetId}?provider=embed-${this.config.version}`
        )

        const response = await promise.json()

        // Set URI encoded title
        const campaignTitle = encodeURIComponent(response.title)

        // Set the HTML
        tonicDiv.innerHTML = `
      <a href="${response.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${widgetId}&utm_content=${campaignTitle}" style="display: block">
      <img src="${response.image_url}" 
      id="${widgetId}"
      width="${response.width}" 
      height="${response.height}" 
      alt="${response.title}" />
      </a>`
        // Set additional information
        tonicDiv.setAttribute('data-width', response.width)
        tonicDiv.setAttribute('data-height', response.height)

        // Add to widgets map
        this.widgets.set(widgetId, response as typeof Widget)
      } catch (e) {
        console.info('Could not display widget:', e)
      }
    }
  }

  // Load the TonicPow script(s) and default settings
  load = async () => {
    // We only work in a browser
    if (typeof window === 'undefined') {
      console.error('TonicPow embed only works in the browser')
      return
    }

    // Load all tonics found on the page (if we have div)
    const tonicDivs = document.getElementsByClassName(this.config.widgetDivClass)
    if (tonicDivs && tonicDivs.length > 0) {
      await this.loadDivs()
      console.log('%c TonicPow widget(s) loaded! ', 'background: #974CD2; color: #fff')
    }

    // Process visitor token
    const session = this.captureVisitorSession()

    // Capture events if we have a session
    if (session) {
      this.events = new Events(session)
    }
  }
}

// Auto-load and set on window
;(window as any).TonicPow = new TonicPow() || {}
