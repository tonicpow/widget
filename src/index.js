import Config from './config.js'
import Storage from './storage.js'

// Start the TonicPow service
let TonicPow = {}

// Load modules
TonicPow.Config = Config
TonicPow.Storage = Storage

// setOreo for creating new oreos
TonicPow.setOreo = (name, value, days) => {
  let d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
}

// captureVisitorSession will capture the session and store it
// Builds a cookie so it's sent on requests automatically
// Stores in local storage for easy access from the application
TonicPow.captureVisitorSession = (customSessionId = '') => {
  let sessionId = customSessionId
  if ((!customSessionId || customSessionId.length === 0) && typeof window !== 'undefined') {
    let urlParams = new URLSearchParams(window.location.search)
    sessionId = urlParams.get(Config.sessionName)
  }
  if (sessionId && sessionId.length > 0) {
    TonicPow.setOreo(Config.sessionName, sessionId, Config.maxSessionDays)
    TonicPow.Storage.setStorage(Config.sessionName, sessionId, (24 * 60 * 60 * Config.maxSessionDays))
  }
}

// getVisitorSession will get the session if it exists
TonicPow.getVisitorSession = () => {
  return TonicPow.Storage.getStorage(Config.sessionName)
}

// loadDivs replaces each TonicPow div with a corresponding embed widget
TonicPow.loadDivs = async () => {
  // Get sticker address from parent page
  // let stickerAddress = (document.head.querySelector('[name=bitcoin-address][content]')) ? document.head.querySelector('[name=bitcoin-address][content]').content : ''

  // Get all divs
  let tonicDivs = document.getElementsByClassName(Config.widgetDivClass)

  // Loop all divs that we found
  for (let i = tonicDivs.length - 1; i >= 0; i--) {

    // Set the div
    let tonicDiv = tonicDivs[i]

    // Get the widget id
    let widgetId = tonicDiv.getAttribute(Config.widgetId)
    if (!widgetId) {
      console.log(widgetId + ' not found')
      continue
    }

    // Get the custom environment (switching away from default: production)
    let customEnvironment = tonicDiv.getAttribute(Config.customEnvironment)
    Config.setEnvironment(customEnvironment)

    // Fire the request to load the widget data
    let promise = await fetch(
      Config.apiUrl + '/v1/widgets/display/' + widgetId + '?provider=embed-' + Config.version
    )
    let response = await promise.json()

    // Set URI encoded title
    let campaignTitle = encodeURIComponent(response.title)

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
}

// Load the TonicPow script(s) and default settings
TonicPow.load = () => {
  // We only work in a browser
  if (typeof window === 'undefined') {
    console.error('TonicPow embed only works in the browser')
    return
  }

  // Load all tonics found on the page (if we have div)
  let tonicDivs = document.getElementsByClassName(Config.widgetDivClass)
  if (tonicDivs && tonicDivs.length > 0) {
    TonicPow.loadDivs().then(r => {
      console.log('TonicPow widget(s) loaded!')
    })
  }

  // Process visitor token
  TonicPow.captureVisitorSession()
}

// Load the TonicPow widget
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // This loads if the <script> is dynamically injected into the page
  TonicPow.load()
} else {
  // This loads if the <script> is hardcoded in the html page in the <head>
  document.addEventListener('DOMContentLoaded', function () {
    TonicPow.load()
  })
}

// Store on the window (safely)
if (typeof window !== 'undefined') {
  window.TonicPow = TonicPow
}
