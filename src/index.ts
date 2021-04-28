import Config from './config'
import Events from './events'
import Storage from './storage'
import TPow from './types'

export default class TonicPow {
  config: Config
  storage: Storage
  events: Events | undefined
  widgets: Map<string, TPow.Widget | null>
  options: TPow.TonicPowOptions | undefined
  buttonViewsInitialized: boolean
  shareButtons: Map<string, TPow.ShareButtonOptions>
  nrOfButtons: number

  constructor(options?: TPow.TonicPowOptions) {
    // Set namespaces
    this.config = new Config()
    this.storage = new Storage()
    this.widgets = new Map<string, TPow.Widget>()
    this.options = options

    this.buttonViewsInitialized = false
    this.shareButtons = new Map<string, TPow.ShareButtonOptions>()
    this.nrOfButtons = 0

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
  setOreo = (name: string, value: string, days: number): void => {
    const date = new Date()
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`
  }

  // captureVisitorSession will capture the session and store it
  // Builds a cookie so it's sent on requests automatically
  // Stores in local storage for easy access from the application
  captureVisitorSession = (customSessionId = '', customChallengeGuid = ''): TPow.Capture => {
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
  getVisitorSession = (): string | null => this.storage.getStorage(this.config.sessionParameterName)

  // loadDivs replaces each TonicPow div with a corresponding embed widget
  loadDivs = async (): Promise<void> => {
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

      // Get the custom environment (switching away from default: production)
      const customEnvironment = tonicDiv.getAttribute(this.config.customEnvironmentAttribute)
      this.config.setEnvironment(customEnvironment || 'production')

      const widgetType = tonicDiv.getAttribute('data-widget-type')
      switch(widgetType) {
        case 'tonicpow-share-button':
          this.initializeButton(tonicDiv)
          break;
        case 'tonicpow-banner':
        default:
          await this.initializeBanner(tonicDiv)
          break;
      }
    }
  }

  private getDataAttributes = function(el: HTMLElement) {
    const data: Record<string, string> = {};
    [].forEach.call(el.attributes, function(attr: Record<string, string>) {
      if (/^data-/.test(attr.name)) {
        const camelCaseName: string = attr.name.substr(5).replace(/-(.)/g, function($0, $1) {
          return $1.toUpperCase()
        })
        data[camelCaseName] = attr.value
      }
    })
    return data
  }

  private initializeButton(tonicDiv: HTMLDivElement) {
    const targetUrl = encodeURIComponent(document.location.href)
    const dataAttributes: Record<string, string> = this.getDataAttributes(tonicDiv)
    if (!dataAttributes.buttonId) {
      tonicDiv.id = 'tonicpow-button-id-' + this.nrOfButtons++;
      dataAttributes.buttonId = tonicDiv.id;
    }

    const buttonOptions: TPow.ShareButtonOptions = this.shareButtons.get(dataAttributes.buttonId) || {};

    for (const key in dataAttributes) {
      // button options override the data attributes
      if (dataAttributes.hasOwnProperty(key) && !(buttonOptions && buttonOptions.hasOwnProperty(key))) {
        buttonOptions[key] = dataAttributes[key]
      }
    }

    let urlAttributes = ''
    for (const key in buttonOptions) {
      if (buttonOptions.hasOwnProperty(key) && typeof buttonOptions[key] === 'string') {
        urlAttributes += `&${key}=${buttonOptions[key]}`
      }
    }

    if (!buttonOptions.width) buttonOptions.width = '150'
    if (!buttonOptions.height) buttonOptions.height = '50'

    this.shareButtons.set(dataAttributes.buttonId, buttonOptions)

    tonicDiv.innerHTML = `
      <iframe
        src='${this.config.hostUrl}/share_button.html?targetUrl=${targetUrl}${urlAttributes}'
        class='tonicpow-widget-share-button'
        width='${buttonOptions.width}'
        height='${buttonOptions.height}'
      />`

    this.initializeButtonViews();
  }

  shareButton = (id: string, options: TPow.ShareButtonOptions): void => {
    this.shareButtons.set(id, options)
  }

  private initializeButtonViews() {
    // push css styles on iFrame rendering
    if (!this.buttonViewsInitialized) {
      const css = `
          * { clear: all }
          .tonicpow-widget-share-button { border: none; }
          .tonicpow-widget-share-button > iframe { overflow: hidden; }
          .tonicpow-modal { font-family: Nunito, Arial; display: flex; align-items: center; padding: 0 1em; text-align: center; width: 100%; height: 100%; position: fixed; top: 0; left: 0; }
          .tonicpow-modal__overlay { background: black; bottom: 0; left: 0; position: fixed; right: 0; text-align: center; top: 0; z-index: -800; opacity: 0.5; }
          .tonicpow-modal__box { padding: 25px; position: relative; margin: 1em auto; max-width: 500px; width: 90%; background-color: #fff; border-radius: 12px; }
          .tonicpow-modal__box > h2 { margin-top: 0; text-align: left; }
          .tonicpow-modal__box > h2 > .tonicpow-modal__close { float: right; cursor: pointer; }
          `
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
      this.buttonViewsInitialized = true;

      window.addEventListener('message', (event) => {
        if (event.data && event.data.buttonId && event.data.source === 'tonicpow') {
          const options: TPow.ShareButtonOptions = this.shareButtons.get(event.data.buttonId) || {}
          if (event.data.error) {
            if (options.hasOwnProperty('onError') && typeof options.onError === 'function') {
              options.onError(event.data)
            } else {
              TonicPow.showPopup({title: 'ERROR: ' + event.data.error, message: event.data.message})
            }
          } else {
            if (options.hasOwnProperty('onSuccess') && typeof options.onSuccess === 'function') {
              options.onSuccess(event.data)
            } else {
              TonicPow.showPopup({title: 'TonicPow link', message: event.data.shortLinkURL})
            }
          }
        }
      });
    }
  }

  private static showPopup(options: TPow.PopupOptions) {
    const elem = document.createElement('div')
    elem.id = 'tonicpow-widget-popup'
    elem.classList.add('tonicpow-modal')
    elem.innerHTML = `
      <div class="tonicpow-modal__overlay" onclick="TonicPow.closePopup();"></div>
      <div class="tonicpow-modal__box">
        <h2>
          ${options.title}
          <span class="tonicpow-modal__close" onclick="TonicPow.closePopup();">X</span>
        </h2>
        <p>${options.message}</p>
      </div>
    `
    document.body.appendChild(elem)
  }

  closePopup = (): void => {
    const popupElement: HTMLElement | null = document.getElementById('tonicpow-widget-popup')
    if (popupElement) {
      popupElement.remove()
    }
  }

  private async initializeBanner(tonicDiv: HTMLDivElement) {
    // Get the widget id
    const widgetId = tonicDiv.getAttribute(this.config.widgetIdAttribute)
    if (!widgetId) {
      console.log(`${widgetId} not found`)
      return
    }

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
          image_url: `${this.config.hostUrl}/images/widgetFallback.svg`
        }
      } else {
        // Get JSON response
        response = await promise.json()
      }

      // Set URI encoded title
      const campaignTitle = encodeURIComponent(response.title)

      // Set the HTML
      tonicDiv.innerHTML = `
      <a href='${response.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${widgetId}&utm_content=${campaignTitle}' style='display: inline-block'>
      <img src='${response.image_url}' 
      width='${response.width}' 
      height='${response.height}' 
      alt='${response.title}' />
      </a>`

      // Set widget dimensions
      tonicDiv.setAttribute('data-width', response.width)
      tonicDiv.setAttribute('data-height', response.height)

      // Add to widgets map
      this.widgets.set(widgetId, response as TPow.Widget)

      // Fire onWidgetLoaded callback if provided
      if (this.options && this.options.onWidgetLoaded) {
        response.id = widgetId
        this.options.onWidgetLoaded(response as TPow.Widget)
      }
    } catch (e) {
      throw e
    }
  }

  // Load the TonicPow script(s) and default settings
  load = async (): Promise<void> => {
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
const tpow = new TonicPow()

declare global {
  interface Window {
    TonicPow: any
  }
}

window.TonicPow = tpow || {}
