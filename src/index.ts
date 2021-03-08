import Config from './config'
import Events from './events'
import Storage from './storage'
import Widget from './types'

interface TonicPowOptions {
  onWidgetLoaded: (widget: typeof Widget) => void
}

export default class TonicPow {
  config: Config
  storage: Storage
  events: Events | undefined
  widgets: Map<String, typeof Widget | null>
  options: TonicPowOptions | undefined

  constructor(options?: TonicPowOptions) {
    // Set namespaces
    this.config = new Config()
    this.storage = new Storage()
    this.widgets = new Map<String, typeof Widget>()
    this.options = options

    // Start the TonicPow service and load modules

    // Load the TonicPow widget when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // This loads if the <script> is dynamically injected into the page
      this.load()
    } else {
      // This loads if the <script> is hardcoded in the html page in the <head>
      document.addEventListener('DOMContentLoaded', () => {
        this.load()
      })
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
  captureVisitorSession = (customSessionId: string = '', customChallengeGuid: string = '') => {
    let sessionId: string | null = customSessionId
    let challengeGuid: string | null = customChallengeGuid
    const urlParams = new URLSearchParams(window.location.search)
    if ((!customSessionId || !customSessionId.length) && typeof window !== 'undefined') {
      sessionId = urlParams.get(this.config.sessionParameterName) || null
    }

    if ((!customChallengeGuid || !customChallengeGuid.length) && typeof window !== 'undefined') {
      challengeGuid = urlParams.get(this.config.challengeParameterName) || null
    }

    if (sessionId && sessionId.length > 0) {
      this.setOreo(this.config.sessionParameterName, sessionId, this.config.maxSessionDays)
      this.storage.setStorage(
        this.config.sessionParameterName,
        sessionId,
        24 * 60 * 60 * this.config.maxSessionDays
      )
    }

    if (challengeGuid && challengeGuid.length > 0) {
      // 60 = 1 minute - will be read by headless browser
      this.storage.setStorage(this.config.challengeParameterName, challengeGuid, 60)
    }
    return { sessionId: sessionId, challengeGuid: challengeGuid }
  }

  // getVisitorSession will get the session if it exists
  getVisitorSession = () => this.storage.getStorage(this.config.sessionParameterName)

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
        console.log('exit early - remove this?')
        continue
      }

      // Get the widget id
      const widgetId = tonicDiv.getAttribute(this.config.widgetIdAttribute)
      if (!widgetId) {
        console.log(`${widgetId} not found`)
        continue
      }

      // Get the custom environment (switching away from default: production)
      const customEnvironment = tonicDiv.getAttribute(this.config.customEnvironmentAttribute)
      this.config.setEnvironment(customEnvironment || 'production')

      // Add to widgets map
      this.widgets.set(widgetId, null)

      try {
        // Fire the request to load the widget data
        const promise = await fetch(
          `${this.config.apiUrl}/v1/widgets/display/${widgetId}?provider=embed-${this.config.version}`
        )

        let response

        // Handle domain not allowed
        if (promise.status === 403) {
          console.info(`${promise.status}: Domain not allowed`)
          response = {
            link_url: this.config.hostUrl,
            image_url: `${this.config.hostUrl}/images/widgetFallback.svg`,
          }
        } else {
          // Get JSON response
          response = await promise.json()
        }

        // Set URI encoded title
        const campaignTitle = encodeURIComponent(response.title)

        // Set the HTML
        tonicDiv.innerHTML = `
      <a href="${response.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${widgetId}&utm_content=${campaignTitle}" style="display: inline-block">
      <img src="${response.image_url}" 
      width="${response.width}" 
      height="${response.height}" 
      alt="${response.title}" />
      </a>`

        // Set widget dimensions
        tonicDiv.setAttribute('data-width', response.width)
        tonicDiv.setAttribute('data-height', response.height)

        // Add to widgets map
        this.widgets.set(widgetId, response as typeof Widget)

        // Fire onWidgetLoaded callback if provided
        if (this.options && this.options.onWidgetLoaded) {
          response.id = widgetId
          this.options.onWidgetLoaded(response as typeof Widget)
        }
      } catch (e) {
        throw e
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
      try {
        await this.loadDivs()
        console.log('%c TonicPow widget(s) loaded! ', 'background: #974CD2; color: #fff')
      } catch (e) {
        throw e
      }
    }

    // Process visitor token
    const { sessionId, challengeGuid } = this.captureVisitorSession()

    // Capture events if we have a session, or responding to a challenge
    if (sessionId || challengeGuid) {
      this.events = new Events(sessionId || '', challengeGuid || '', this.config)
    }
  }
}

// Auto-load and set on window
let tpow = new TonicPow()

;(window as any).TonicPow = tpow || {}
