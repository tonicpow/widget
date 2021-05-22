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
    const elem = document.createElement('div')
    elem.id = 'tonicpow-widget-popup'
    elem.classList.add('tonicpow-modal')

    const modalGridElement: HTMLElement = document.createElement('div')
    modalGridElement.classList.add('tonicpow-modal__grid')

    // COPY
    const copyIconElement: HTMLElement = document.createElement('div')
    copyIconElement.classList.add('tonicpow-icon')
    copyIconElement.onclick = () => window.TonicPow.copyText(options.shortLink?.short_link_url)
    copyIconElement.innerHTML = copyIcon

    // FACEBOOK
    const facebookIconElement: HTMLElement = document.createElement('div')
    facebookIconElement.classList.add('tonicpow-icon')
    facebookIconElement.style.color = 'rgb(66, 103, 178)'
    facebookIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Facebook)
    facebookIconElement.innerHTML = facebookIcon

    // TWITTER
    const twitterIconElement: HTMLElement = document.createElement('div')
    twitterIconElement.classList.add('tonicpow-icon')
    twitterIconElement.style.color = 'rgb(29, 161, 242)'
    twitterIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Twitter)
    twitterIconElement.innerHTML = twitterIcon

    // TWETCH
    const twetchIconElement: HTMLElement = document.createElement('div')
    twetchIconElement.classList.add('tonicpow-icon')
    twetchIconElement.style.color = 'rgb(8, 90, 246)'
    twetchIconElement.onclick = () =>
      window.TonicPow.shareOnPlatform(options.shortLink, Platform.Twetch)
    twetchIconElement.innerHTML = twetchIcon

    modalGridElement.appendChild(twetchIconElement)
    modalGridElement.appendChild(twitterIconElement)
    modalGridElement.appendChild(facebookIconElement)
    modalGridElement.appendChild(copyIconElement)

    const modalBoxElement: HTMLElement = document.createElement('div')
    modalBoxElement.classList.add('tonicpow-modal__box')
    modalBoxElement.innerHTML = `
      <h2>
        ${options.title}
        <div class="tonicpow-modal__close" onclick="TonicPow.closePopup();">
          <div class="tonicpow-icon">${closeIcon}</div>
        </div>
      </h2>
      <div class="tonicpow-modal__campaign">
        <img class="tonicpow-modal__campaign_image" src="${options.shortLink?.image_url}" />
        <div class="tonicpow-modal__campaign_title">${options.shortLink?.title}</div>
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

// Assets
const copyIcon = `<svg fill="none" x="0px" y="0px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" class="w-6 h-6 mr-1 text-gray-800"><path fill="currentColor" d="M8 4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h2zm0 2H6v14h12V6h-2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zm2-2v2h4V4h-4z"></path></svg>`
const facebookIcon = `<svg fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg>`
const twitterIcon = `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>`
const twetchIcon = `<svg focusable="false" viewBox="0 0 20 17" aria-hidden="true" width="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1804 11.1469L10.2223 11.839C10.3483 13.6326 9.24308 15.2709 7.49438 15.9065C6.85086 16.1325 5.75967 16.1607 5.0462 15.963C4.76641 15.8782 4.23481 15.5958 3.85709 15.3416L3.1716 14.8755L2.41616 15.1156C1.99647 15.2427 1.43689 15.4545 1.18508 15.5958C0.947252 15.7229 0.73741 15.7935 0.73741 15.7511C0.73741 15.511 1.25502 14.6919 1.6887 14.2399C2.27626 13.6044 2.10839 13.5479 0.919274 13.9716C0.205805 14.2117 0.191816 14.2117 0.331711 13.9433C0.41565 13.8021 0.849325 13.3078 1.31098 12.8558C2.0944 12.0791 2.13637 11.9943 2.13637 11.3446C2.13637 10.3419 2.61202 8.25163 3.08766 7.10763C3.969 4.96088 5.8576 2.74351 7.74619 1.62777C10.4042 0.060073 13.9436 -0.335381 16.9234 0.582639C17.9166 0.893352 19.6234 1.68426 19.6234 1.82549C19.6234 1.86786 19.1057 1.92436 18.4762 1.93848C17.1612 1.96673 15.8462 2.33394 14.727 2.98361L13.9716 3.43556L14.8389 3.73215C16.07 4.15585 17.1752 5.13036 17.455 6.04838C17.5389 6.34497 17.5109 6.3591 16.7275 6.3591L15.9161 6.37322L16.6016 6.69806C17.413 7.10764 18.1544 7.79968 18.5182 8.50585C18.784 9.01429 19.1197 10.2995 19.0218 10.3984C18.9938 10.4408 18.7 10.356 18.3643 10.243C17.399 9.88994 17.2731 9.97468 17.8327 10.5679C18.8819 11.6412 19.2037 13.2372 18.7 14.7484L18.4622 15.4263L17.5389 14.5083C15.6503 12.6581 13.426 11.5565 10.8799 11.2317L10.1804 11.1469ZM6.34177 14.0879L5.59676 14.0879L4.86489 13.0186L4.12863 14.0879L3.388 14.0879L4.44855 12.5891L3.45374 11.1648L4.19437 11.1648L4.86489 12.164L5.52664 11.1648L6.27604 11.1648L5.28122 12.5847L6.34177 14.0879Z" fill="currentColor"></path></svg>`
const closeIcon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`
