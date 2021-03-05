import Config from './config'
import Events from './events'
import Storage from './storage'

// height: 250
// image_url: "https://res.cloudinary.com/tonicpow/image/upload/c_crop,x_0,y_0,w_300,h_250/w_300,h_250,c_limit,g_center/v1606622248/ocwkfsjsb2hz2ostxydn.jpg"
// link_url: "https://staging.tpow.app/c1d0f8c9"
// title: "Something cool"
// width: 300
interface Widget {
  height: number
  image_url: string
  link_url: string
  title: string
  width: number
  id: number
}

// Options when creating a TonicPow instance
interface TonicPowOptions {
  AutoInit: boolean // Manually initialize instead of auto-detecting divs
  WidgetRequestCallback: (widget: Widget) => void
}

// Detault options
const defaultOptions: TonicPowOptions = {
  AutoInit: true,
  WidgetRequestCallback: (widget: Widget) => {},
}

export default class TonicPow {
  config: Config
  storage: Storage
  events: Events | undefined

  constructor(options: TonicPowOptions = defaultOptions) {
    // Imbue options
    for (let [optionKey, optionVal] of Object.entries(options)) {
      Object.defineProperty(this, optionKey, {
        value: optionVal,
        writable: false,
      })
    }

    // Set namespaces
    this.config = new Config()
    this.storage = new Storage()

    // Start the TonicPow service and load modules
    if (options.AutoInit) {
      // Load the TonicPow widget
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
  }

  // registerEvents -Registers event listeners. Runs only once
  registerEvents = () => {
    if (!this.events) {
      // Register events if we have a valid session
      let session = this.getVisitorSession()
      if (session) {
        console.log('registering session', session)
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
      const tonicDiv = tonicDivs[i]

      // Get the widget id
      const widgetId = tonicDiv.getAttribute(this.config.widgetId)
      if (!widgetId) {
        console.log(`${widgetId} not found`)
        continue
      }

      // Get the custom environment (switching away from default: production)
      const customEnvironment = tonicDiv.getAttribute(this.config.customEnvironment)
      this.config.setEnvironment(customEnvironment || 'production')

      // Fire the request to load the widget data
      const promise = await fetch(
        `${this.config.apiUrl}/v1/widgets/display/${widgetId}?provider=embed-${this.config.version}`
      )
      const response = await promise.json()

      // Fire callback
      defaultOptions.WidgetRequestCallback(response as Widget)

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
    }
  }

  // Load the TonicPow script(s) and default settings
  load = () => {
    // We only work in a browser
    if (typeof window === 'undefined') {
      console.error('TonicPow embed only works in the browser')
      return
    }

    // Load all tonics found on the page (if we have div)
    const tonicDivs = document.getElementsByClassName(this.config.widgetDivClass)
    if (tonicDivs && tonicDivs.length > 0) {
      this.loadDivs().then(() => {
        console.log('TonicPow widget(s) loaded!')
      })
    }

    // Process visitor token
    const session = this.captureVisitorSession()

    // Capture events if we have a session
    if (session) {
      this.events = new Events(session)
    }
  }
}

// TODO - how tf do we we autorun this now?

// Set on window
;(window as any).TonicPow = TonicPow || {}
