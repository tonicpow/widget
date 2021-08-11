import Config from './config'
import Events from './events'
import Storage from './storage'
import TPow from './types'

enum Platform {
  LinkedIn = 'linkedin',
  PowPing = 'powping',
  Twitter = 'twitter',
  Twetch = 'twetch',
  Facebook = 'facebook',
}

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
      switch (widgetType) {
        case 'share-button':
          this.initializeButton(tonicDiv)
          break
        case 'banner':
        default:
          await this.initializeBanner(tonicDiv)
          break
      }
    }
  }

  private getDataAttributes = function (el: HTMLElement) {
    const data: Record<string, string> = {}
    ;[].forEach.call(el.attributes, function (attr: Record<string, string>) {
      if (/^data-/.test(attr.name)) {
        const camelCaseName: string = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase()
        })
        data[camelCaseName] = attr.value
      }
    })
    return data
  }

  private initializeButton(tonicDiv: HTMLDivElement) {
    const dataAttributes: Record<string, string> = this.getDataAttributes(tonicDiv)
    if (!dataAttributes.buttonId) {
      tonicDiv.id = 'tonicpow-button-id-' + this.nrOfButtons++
      dataAttributes.buttonId = tonicDiv.id
    }

    const buttonOptions: TPow.ShareButtonOptions =
      this.shareButtons.get(dataAttributes.buttonId) || {}

    for (const key in dataAttributes) {
      // button options override the data attributes
      if (
        dataAttributes.hasOwnProperty(key) &&
        !(buttonOptions && buttonOptions.hasOwnProperty(key))
      ) {
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
    if (!buttonOptions.targetUrl)
      buttonOptions.targetUrl = encodeURIComponent(document.location.href)

    this.shareButtons.set(dataAttributes.buttonId, buttonOptions)

    tonicDiv.innerHTML = `
      <iframe
        src='${this.config.hostUrl}/share_button.html?targetUrl=${buttonOptions.targetUrl}${urlAttributes}'
        class='tonicpow-widget-share-button'
        width='${buttonOptions.width}'
        height='${buttonOptions.height}'
      />`

    this.initializeButtonViews()
  }

  shareButton = (id: string, options: TPow.ShareButtonOptions): void => {
    this.shareButtons.set(id, options)
  }

  private initializeButtonViews() {
    // push css styles on iFrame rendering
    if (!this.buttonViewsInitialized) {
      const css = `
          * { clear: all }
          .tonicpow-icon { width: 1.5rem; height: 1.5rem; cursor: pointer; margin: auto; }
          .tonicpow-icon > object { pointer-events: none; }
          .tonicpow-widget-share-button { border: none; }
          .tonicpow-widget-share-button > iframe { overflow: hidden; }
          .tonicpow-modal { font-family: Nunito, Arial; display: flex; align-items: center; padding: 0 1em; text-align: center; width: 100%; height: 100%; position: fixed; top: 0; left: 0; }
          .tonicpow-modal__overlay { background: black; bottom: 0; left: 0; position: fixed; right: 0; text-align: center; top: 0; z-index: -800; opacity: 0.5; }
          .tonicpow-modal__box { padding: 25px; position: relative; margin: 1em auto; max-width: 500px; width: 90%; background-color: #fff; border-radius: 12px; }
          .tonicpow-modal__box > h2 { margin-top: 0; text-align: left; }
          .tonicpow-modal__box > h2 > .tonicpow-modal__close { float: right; cursor: pointer; }
          .tonicpow-modal__box > .tonicpow-modal__grid { padding: 2rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .tonicpow-modal__box > .tonicpow-modal__campaign { position: relative; border: 1px solid #f2f2f2; }
          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_title { display: flex; justify-content: center; align-items: center; position: absolute; border-radius: 0 0 .5rem .5rem; background: rgba(0,0,0,.5); left: 0; color: white; bottom: 0; width: 100%; height: 2rem; }
          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_ppc { position: absolute; background: rgba(0,200,0,.5); right: .5rem; color: white; top: .5rem; }
          .tonicpow-modal__box > .tonicpow-modal__campaign > img { display: block; border-radius: .5rem; width: 100% }
          `
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
      this.buttonViewsInitialized = true

      window.addEventListener('message', (event) => {
        if (event.data && event.data.buttonId && event.data.source === 'tonicpow') {
          const options: TPow.ShareButtonOptions = this.shareButtons.get(event.data.buttonId) || {}
          if (event.data.error) {
            if (options.hasOwnProperty('onError') && typeof options.onError === 'function') {
              options.onError(event.data)
            } else {
              TonicPow.showPopup({
                title: 'ERROR: ' + event.data.error,
                shortLink: event.data.message,
              })
            }
          } else {
            if (options.hasOwnProperty('onSuccess') && typeof options.onSuccess === 'function') {
              options.onSuccess(event.data)
            } else {
              TonicPow.showPopup({
                title: 'Share & Earn',
                shortLink: event.data.shortLink as TPow.ShortLink,
              })
            }
          }
        }
      })
    }
  }

  private static showPopup(options: TPow.PopupOptions) {
    // Assets
    const copyIcon = `${window.TonicPow.config.hostUrl}/images/icons/copyIcon.svg`
    const facebookIcon = `${window.TonicPow.config.hostUrl}/images/icons/facebookIcon.svg`
    const twitterIcon = `${window.TonicPow.config.hostUrl}/images/icons/twitterIcon.svg`
    const twetchIcon = `${window.TonicPow.config.hostUrl}/images/icons/twetchIcon.svg`
    const closeIcon = `${window.TonicPow.config.hostUrl}/images/icons/closeIcon.svg`
    const tonicPowPlaceholder = `${window.TonicPow.config.hostUrl}/images/image_placeholder_tonicpow.png`

    const elem = document.createElement('div')
    elem.id = 'tonicpow-widget-popup'
    elem.classList.add('tonicpow-modal')

    const modalGridElement: HTMLElement = document.createElement('div')
    modalGridElement.classList.add('tonicpow-modal__grid')

    // COPY
    const copyIconElement: HTMLElement = document.createElement('div')
    copyIconElement.classList.add('tonicpow-icon')
    copyIconElement.onclick = () => window.TonicPow.copyText(options.shortLink?.short_link_url)

    const copyIconObject = document.createElement('object')
    copyIconObject.setAttribute('data', copyIcon)
    copyIconObject.setAttribute('width', '24')
    copyIconObject.setAttribute('height', '24')
    copyIconElement.appendChild(copyIconObject)

    // FACEBOOK
    const facebookIconElement: HTMLElement = document.createElement('div')
    facebookIconElement.classList.add('tonicpow-icon')
    facebookIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Facebook)

    const facebookIconObject = document.createElement('object')
    facebookIconObject.setAttribute('data', facebookIcon)
    facebookIconObject.setAttribute('width', '24')
    facebookIconObject.setAttribute('height', '24')
    facebookIconElement.appendChild(facebookIconObject)

    // TWITTER
    const twitterIconElement: HTMLElement = document.createElement('div')
    twitterIconElement.classList.add('tonicpow-icon')
    twitterIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Twitter)

    const twitterIconObject = document.createElement('object')
    twitterIconObject.setAttribute('data', twitterIcon)
    twitterIconObject.setAttribute('width', '24')
    twitterIconObject.setAttribute('height', '24')
    twitterIconElement.appendChild(twitterIconObject)

    // TWETCH
    const twetchIconElement: HTMLElement = document.createElement('div')
    twetchIconElement.classList.add('tonicpow-icon')
    twetchIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Twetch)

    const twetchIconObject = document.createElement('object')
    twetchIconObject.setAttribute('data', twetchIcon)
    twetchIconObject.setAttribute('width', '24')
    twetchIconObject.setAttribute('height', '24')
    twetchIconElement.appendChild(twetchIconObject)

    modalGridElement.appendChild(twetchIconElement)
    modalGridElement.appendChild(twitterIconElement)
    modalGridElement.appendChild(facebookIconElement)
    modalGridElement.appendChild(copyIconElement)

    const modalBoxElement: HTMLElement = document.createElement('div')
    modalBoxElement.classList.add('tonicpow-modal__box')
    modalBoxElement.innerHTML = `
      <h2>
        ${options.title}
        <div class="tonicpow-modal__close tonicpow-icon" onclick="TonicPow.closePopup();">
          <object data="${closeIcon}"></object>
        </div>
      </h2>
      <div class="tonicpow-modal__campaign">
        <img class="tonicpow-modal__campaign_image" src="${
          options.shortLink?.image_url?.length ? options.shortLink?.image_url : tonicPowPlaceholder
        }" />
        <div class="tonicpow-modal__campaign_title">${
          options.shortLink?.title.length ? options.shortLink.title : 'TonicPow Campaign'
        }</div>
      </div>
      <p id="tonicpow__short-link-text">${options.shortLink?.short_link_url}</p>      

  `

    modalBoxElement.appendChild(modalGridElement)

    elem.innerHTML = `<div>
        <div class="tonicpow-modal__overlay" onclick="TonicPow.closePopup();"></div>
      </div>
    `

    elem.appendChild(modalBoxElement)

    document.body.appendChild(elem)
  }

  shareOnPlatform = (shortlink: TPow.ShortLink, platform: Platform): void => {
    // Normally the shortlink should already be available when this function is called
    const message = `Check this out 😎 ${shortlink.title} - ${shortlink.short_link_url}`

    switch (platform) {
      case Platform.Facebook:
        // TODO: From env var
        window.open(
          `https://www.facebook.com/dialog/share?quote=${shortlink.title}&hashtag=ad&href=${shortlink.short_link_url}&display=popup&app_id=${this.config.fbAppId}`
        )
        break
      case Platform.LinkedIn:
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${shortlink.short_link_url}&title=${shortlink.title}&description=${message}`
        )
        break
      case Platform.PowPing:
        window.open(`https://powping.com/?text=${message}`, '_blank')
        break
      case Platform.Twetch:
        window.open(`https://twetch.app/compose?description=${message}`, '_blank')
        break
      case Platform.Twitter:
        window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank')
        break
    }

    // onClose();
  }

  copyText = (text: string): void => {
    const popupElement: HTMLElement | null = document.getElementById('tonicpow-widget-popup')
    if (popupElement) {
      const input = document.createElement('textarea')
      input.innerHTML = text
      popupElement.appendChild(input)
      input.select()
      const copied = document.execCommand('copy')
      popupElement.removeChild(input)

      if (copied) {
        // show copied text for a few seconds
        const linkTextElement: HTMLElement | null = document.getElementById(
          'tonicpow__short-link-text'
        )
        if (linkTextElement) {
          const linkText = linkTextElement.innerHTML
          linkTextElement.innerHTML = 'Copied!'
          setTimeout(() => {
            linkTextElement.innerHTML = linkText
          }, 3000)
        }
      }
      // return result;
    }
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
      <a href='${response.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${widgetId}&utm_content=${campaignTitle}'
       style='display: inline-block'
       rel='noopener sponsored'>
        <img src='${response.image_url}' 
          width='${response.width}' 
          height='${response.height}' 
          alt='${response.title}'
          loading='lazy' />
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
