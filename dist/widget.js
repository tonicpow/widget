(()=>{var t={913:(t,e,i)=>{var o;void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(){this.isEnvironmentValid=t=>this.environments.includes(t),this.setEnvironment=t=>{t&&this.isEnvironmentValid(t)&&(this.environment=t,t===this.environmentStaging?(this.apiUrl=this.apiUrlStaging,this.eventsUrl=this.eventsUrlStaging,this.hostUrl=this.hostUrlStaging):t===this.environmentLocal?(this.apiUrl=this.apiUrlLocal,this.eventsUrl=this.eventsUrlLocal,this.hostUrl=this.hostUrlLocal):t===this.environmentProduction&&(this.apiUrl=this.apiUrlProduction,this.eventsUrl=this.eventsUrlProduction,this.hostUrl=this.hostUrlProduction))},this.environmentLocal="local",this.environmentStaging="staging",this.environmentProduction="production",this.apiUrl="https://api.tonicpow.com",this.apiUrlLocal="http://localhost:3000",this.apiUrlStaging="https://api.staging.tonicpow.com",this.apiUrlProduction="https://api.tonicpow.com",this.eventsUrl="https://events.tonicpow.com",this.eventsUrlLocal="http://localhost:3002",this.eventsUrlStaging="https://events.staging.tonicpow.com",this.eventsUrlProduction="https://events.tonicpow.com",this.hostUrl="http://tonicpow.com",this.hostUrlLocal="http://localhost",this.hostUrlStaging="https://web.staging.tonicpow.com",this.hostUrlProduction="https://tonicpow.com",this.customEnvironmentAttribute="data-environment",this.environment="",this.environments=[this.environmentLocal,this.environmentStaging,this.environmentProduction],this.maxSessionDays=60,this.sessionParameterName="tncpw_session",this.challengeParameterName="tncpw_challenge",this.version="v0.0.10",this.widgetDivClass="tonicpow-widget",this.widgetIdAttribute="data-widget-id",this.fbAppId="293952358462196"}}}.apply(e,[i,e]))||(t.exports=o)},242:function(t,e,i){var o,n=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function r(t){try{c(o.next(t))}catch(t){s(t)}}function a(t){try{c(o.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}c((o=o.apply(t,e||[])).next())}))};void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(t="",e="",i){this.sendPing=()=>{setTimeout((()=>{this.sendEvent("ping",((new Date).getTime()-this.start).toString())}),4e3)},this.detectWidgetClick=()=>{document.addEventListener("click",(t=>n(this,void 0,void 0,(function*(){var e,i;const o=(t||window.event).target,n=null===(e=null==o?void 0:o.parentElement)||void 0===e?void 0:e.parentElement;if(null===(i=null==n?void 0:n.classList)||void 0===i?void 0:i.contains("tonicpow-widget"))try{yield this.sendEvent("widget_click",n.getAttribute(this.config.widgetIdAttribute)||"")}catch(t){console.error("failed to report interaction: widget_click",t)}}))))},this.detectBounce=()=>{window.onbeforeunload=()=>{this.sendEvent("bounce",((new Date).getTime()-this.start).toString())}},this.sendChallengeResponse=()=>{try{this.sendEvent("challenge",this.challengeGuid)}catch(t){console.error("Failed to send challenge response",t)}},this.detectInteraction=()=>{document.addEventListener("mousedown",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","mousedown")}catch(t){console.error("failed to report interaction: mousedown",t)}})))),document.addEventListener("scroll",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","scroll")}catch(t){console.error("failed to report interaction: scroll",t)}})))),document.addEventListener("keypress",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","keypress")}catch(t){console.error("failed to report interaction: keypress",t)}}))))},this.sendEvent=(t,e)=>n(this,void 0,void 0,(function*(){if(!this.sessionId&&!this.challengeGuid)return void console.info("you must call init with a session before sending events");const i=window.location.href,o={v:this.config.version,name:t,location:i,data:e};this.sessionId&&(o.tncpw_session=this.sessionId),yield fetch(`${this.config.eventsUrl}/v1/events?d=${btoa(JSON.stringify(o))}`,{method:"get"})})),this.sessionId=t,this.config=i,this.challengeGuid=e,this.interactionSent=!1,this.start=(new Date).getTime(),this.challengeGuid&&this.challengeGuid.length>0?this.sendChallengeResponse():(this.detectInteraction(),this.detectBounce(),this.detectWidgetClick(),this.sendPing())}}}.apply(e,[i,e]))||(t.exports=o)},607:function(t,e,i){var o,n,s=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function r(t){try{c(o.next(t))}catch(t){s(t)}}function a(t){try{c(o.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}c((o=o.apply(t,e||[])).next())}))},r=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};o=[i,e,i(913),i(242),i(912)],void 0===(n=function(t,e,i,o,n){"use strict";var a;Object.defineProperty(e,"__esModule",{value:!0}),i=r(i),o=r(o),n=r(n),function(t){t.LinkedIn="linkedin",t.PowPing="powping",t.Twitter="twitter",t.Twetch="twetch",t.Facebook="facebook"}(a||(a={}));class c{constructor(t){this.setOreo=(t,e,i)=>{const o=new Date;o.setTime(o.getTime()+864e5*i),document.cookie=`${t}=${e};path=/;expires=${o.toUTCString()}`},this.captureVisitorSession=(t="",e="")=>{let i=t,o=e;const n=new URLSearchParams(window.location.search);return t&&t.length||"undefined"==typeof window||(i=n.get(this.config.sessionParameterName)||null),e&&e.length||"undefined"==typeof window||(o=n.get(this.config.challengeParameterName)||null),i&&i.length>0&&(this.setOreo(this.config.sessionParameterName,i,this.config.maxSessionDays),this.storage.setStorage(this.config.sessionParameterName,i,86400*this.config.maxSessionDays)),o&&o.length>0&&this.storage.setStorage(this.config.challengeParameterName,o,60),{sessionId:i,challengeGuid:o}},this.getVisitorSession=()=>this.storage.getStorage(this.config.sessionParameterName),this.loadDivs=()=>s(this,void 0,void 0,(function*(){const t=document.getElementsByClassName(this.config.widgetDivClass);for(let e=t.length-1;e>=0;e--){const i=t[e];if(!i){console.log("exit early - remove this?");continue}const o=i.getAttribute(this.config.customEnvironmentAttribute);switch(this.config.setEnvironment(o||"production"),i.getAttribute("data-widget-type")){case"share-button":this.initializeButton(i);break;case"banner":default:yield this.initializeBanner(i)}}})),this.getDataAttributes=function(t){const e={};return[].forEach.call(t.attributes,(function(t){if(/^data-/.test(t.name)){const i=t.name.substr(5).replace(/-(.)/g,(function(t,e){return e.toUpperCase()}));e[i]=t.value}})),e},this.shareButton=(t,e)=>{this.shareButtons.set(t,e)},this.shareOnPlatform=(t,e)=>{console.log("share",t,"platform",e);const i=`Check this out 😎 ${t.title} - ${t.short_link_url}`;switch(e){case a.Facebook:window.open(`https://www.facebook.com/dialog/share?quote=${t.title}&hashtag=ad&href=${t.short_link_url}&display=popup&app_id=${this.config.fbAppId}`);break;case a.LinkedIn:window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${t.short_link_url}&title=${t.title}&description=${i}`);break;case a.PowPing:window.open(`https://powping.com/?text=${i}`,"_blank");break;case a.Twetch:window.open(`https://twetch.app/compose?description=${i}`,"_blank");break;case a.Twitter:window.open(`https://twitter.com/intent/tweet?text=${i}`,"_blank")}},this.copyText=t=>{console.log("copy",t);const e=document.getElementById("tonicpow-widget-popup");if(e){const i=document.createElement("textarea");i.innerHTML=t,e.appendChild(i),i.select();const o=document.execCommand("copy");if(e.removeChild(i),o){const t=document.getElementById("tonicpow__short-link-text");if(t){const e=t.innerHTML;t.innerHTML="Copied!",setTimeout((()=>{t.innerHTML=e}),3e3)}}}},this.closePopup=()=>{const t=document.getElementById("tonicpow-widget-popup");t&&t.remove()},this.load=()=>s(this,void 0,void 0,(function*(){if("undefined"==typeof window)return void console.error("TonicPow embed only works in the browser");const t=document.getElementsByClassName(this.config.widgetDivClass);if(t&&t.length>0)try{yield this.loadDivs(),console.log("%c TonicPow widget(s) loaded! ","background: #974CD2; color: #fff")}catch(t){throw t}const{sessionId:e,challengeGuid:i}=this.captureVisitorSession();(e||i)&&(this.events=new o.default(e||"",i||"",this.config))})),this.config=new i.default,this.storage=new n.default,this.widgets=new Map,this.options=t,this.buttonViewsInitialized=!1,this.shareButtons=new Map,this.nrOfButtons=0,"complete"===document.readyState||"interactive"===document.readyState?this.load():document.addEventListener("DOMContentLoaded",(()=>{this.load()}))}initializeButton(t){const e=this.getDataAttributes(t);e.buttonId||(t.id="tonicpow-button-id-"+this.nrOfButtons++,e.buttonId=t.id);const i=this.shareButtons.get(e.buttonId)||{};for(const t in e)!e.hasOwnProperty(t)||i&&i.hasOwnProperty(t)||(i[t]=e[t]);let o="";for(const t in i)i.hasOwnProperty(t)&&"string"==typeof i[t]&&(o+=`&${t}=${i[t]}`);i.width||(i.width="150"),i.height||(i.height="50"),i.targetUrl||(i.targetUrl=encodeURIComponent(document.location.href)),this.shareButtons.set(e.buttonId,i),t.innerHTML=`\n      <iframe\n        src='${this.config.hostUrl}/share_button.html?targetUrl=${i.targetUrl}${o}'\n        class='tonicpow-widget-share-button'\n        width='${i.width}'\n        height='${i.height}'\n      />`,this.initializeButtonViews()}initializeButtonViews(){if(!this.buttonViewsInitialized){const t="\n          * { clear: all }\n          .tonicpow-icon { width: 1.5rem; height: 1.5rem; cursor: pointer; margin: auto; }\n          .tonicpow-widget-share-button { border: none; }\n          .tonicpow-widget-share-button > iframe { overflow: hidden; }\n          .tonicpow-modal { font-family: Nunito, Arial; display: flex; align-items: center; padding: 0 1em; text-align: center; width: 100%; height: 100%; position: fixed; top: 0; left: 0; }\n          .tonicpow-modal__overlay { background: black; bottom: 0; left: 0; position: fixed; right: 0; text-align: center; top: 0; z-index: -800; opacity: 0.5; }\n          .tonicpow-modal__box { padding: 25px; position: relative; margin: 1em auto; max-width: 500px; width: 90%; background-color: #fff; border-radius: 12px; }\n          .tonicpow-modal__box > h2 { margin-top: 0; text-align: left; }\n          .tonicpow-modal__box > h2 > .tonicpow-modal__close { float: right; cursor: pointer; }\n          .tonicpow-modal__box > .tonicpow-modal__grid { padding: 2rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }\n          .tonicpow-modal__box > .tonicpow-modal__campaign { position: relative; border: 1px solid #f2f2f2; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_title { display: flex; justify-content: center; align-items: center; position: absolute; border-radius: 0 0 .5rem .5rem; background: rgba(0,0,0,.5); left: 0; color: white; bottom: 0; width: 100%; height: 2rem; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_ppc { position: absolute; background: rgba(0,200,0,.5); right: .5rem; color: white; top: .5rem; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > img { display: block; border-radius: .5rem; width: 100% }\n          ",e=document.createElement("style");e.appendChild(document.createTextNode(t)),document.head.appendChild(e),this.buttonViewsInitialized=!0,window.addEventListener("message",(t=>{if(t.data&&t.data.buttonId&&"tonicpow"===t.data.source){const e=this.shareButtons.get(t.data.buttonId)||{};t.data.error?e.hasOwnProperty("onError")&&"function"==typeof e.onError?e.onError(t.data):c.showPopup({title:"ERROR: "+t.data.error,shortLink:t.data.message}):e.hasOwnProperty("onSuccess")&&"function"==typeof e.onSuccess?e.onSuccess(t.data):(console.log("show popup",t.data),c.showPopup({title:"Share & Earn",shortLink:t.data.shortLink}))}}))}}static showPopup(t){var e,i,o;const n=document.createElement("div");n.id="tonicpow-widget-popup",n.classList.add("tonicpow-modal");const s=document.createElement("div");s.classList.add("tonicpow-modal__grid");const r=document.createElement("div");r.classList.add("tonicpow-icon"),r.onclick=()=>{var e;return window.TonicPow.copyText(null===(e=t.shortLink)||void 0===e?void 0:e.short_link_url)},r.innerHTML=d;const c=document.createElement("div");c.classList.add("tonicpow-icon"),c.style.color="rgb(66, 103, 178)",c.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Facebook),c.innerHTML=h;const l=document.createElement("div");l.classList.add("tonicpow-icon"),l.style.color="rgb(29, 161, 242)",l.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Twitter),l.innerHTML=p;const m=document.createElement("div");m.classList.add("tonicpow-icon"),m.style.color="rgb(8, 90, 246)",m.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Twetch),m.innerHTML=u,s.appendChild(m),s.appendChild(l),s.appendChild(c),s.appendChild(r);const w=document.createElement("div");w.classList.add("tonicpow-modal__box"),w.innerHTML=`\n      <h2>\n        ${t.title}\n        <div class="tonicpow-modal__close" onclick="TonicPow.closePopup();">\n          <div class="tonicpow-icon">${g}</div>\n        </div>\n      </h2>\n      <div class="tonicpow-modal__campaign">\n        <img class="tonicpow-modal__campaign_image" src="${null===(e=t.shortLink)||void 0===e?void 0:e.image_url}" />\n        <div class="tonicpow-modal__campaign_title">${null===(i=t.shortLink)||void 0===i?void 0:i.title}</div>\n      </div>\n      <p id="tonicpow__short-link-text">${null===(o=t.shortLink)||void 0===o?void 0:o.short_link_url}</p>      \n\n  `,w.appendChild(s),n.innerHTML='<div>\n        <div class="tonicpow-modal__overlay" onclick="TonicPow.closePopup();"></div>\n      </div>\n    ',n.appendChild(w),document.body.appendChild(n)}initializeBanner(t){return s(this,void 0,void 0,(function*(){const e=t.getAttribute(this.config.widgetIdAttribute);if(e){this.widgets.set(e,null);try{const i=yield fetch(`${this.config.apiUrl}/v1/widgets/display/${e}?provider=embed-${this.config.version}`);let o;403===i.status?(console.info(`${i.status}: Domain not allowed`),o={link_url:this.config.hostUrl,image_url:`${this.config.hostUrl}/images/widgetFallback.svg`}):o=yield i.json();const n=encodeURIComponent(o.title);t.innerHTML=`\n      <a href='${o.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${e}&utm_content=${n}' style='display: inline-block'>\n        <img src='${o.image_url}' \n          width='${o.width}' \n          height='${o.height}' \n          alt='${o.title}' />\n      </a>`,t.setAttribute("data-width",o.width),t.setAttribute("data-height",o.height),this.widgets.set(e,o),this.options&&this.options.onWidgetLoaded&&(o.id=e,this.options.onWidgetLoaded(o))}catch(t){throw t}}else console.log(`${e} not found`)}))}}e.default=c;const l=new c;window.TonicPow=l||{};const d='<svg fill="none" x="0px" y="0px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" class="w-6 h-6 mr-1 text-gray-800"><path fill="currentColor" d="M8 4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h2zm0 2H6v14h12V6h-2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zm2-2v2h4V4h-4z"></path></svg>',h='<svg fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg>',p='<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>',u='<svg focusable="false" viewBox="0 0 20 17" aria-hidden="true" width="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1804 11.1469L10.2223 11.839C10.3483 13.6326 9.24308 15.2709 7.49438 15.9065C6.85086 16.1325 5.75967 16.1607 5.0462 15.963C4.76641 15.8782 4.23481 15.5958 3.85709 15.3416L3.1716 14.8755L2.41616 15.1156C1.99647 15.2427 1.43689 15.4545 1.18508 15.5958C0.947252 15.7229 0.73741 15.7935 0.73741 15.7511C0.73741 15.511 1.25502 14.6919 1.6887 14.2399C2.27626 13.6044 2.10839 13.5479 0.919274 13.9716C0.205805 14.2117 0.191816 14.2117 0.331711 13.9433C0.41565 13.8021 0.849325 13.3078 1.31098 12.8558C2.0944 12.0791 2.13637 11.9943 2.13637 11.3446C2.13637 10.3419 2.61202 8.25163 3.08766 7.10763C3.969 4.96088 5.8576 2.74351 7.74619 1.62777C10.4042 0.060073 13.9436 -0.335381 16.9234 0.582639C17.9166 0.893352 19.6234 1.68426 19.6234 1.82549C19.6234 1.86786 19.1057 1.92436 18.4762 1.93848C17.1612 1.96673 15.8462 2.33394 14.727 2.98361L13.9716 3.43556L14.8389 3.73215C16.07 4.15585 17.1752 5.13036 17.455 6.04838C17.5389 6.34497 17.5109 6.3591 16.7275 6.3591L15.9161 6.37322L16.6016 6.69806C17.413 7.10764 18.1544 7.79968 18.5182 8.50585C18.784 9.01429 19.1197 10.2995 19.0218 10.3984C18.9938 10.4408 18.7 10.356 18.3643 10.243C17.399 9.88994 17.2731 9.97468 17.8327 10.5679C18.8819 11.6412 19.2037 13.2372 18.7 14.7484L18.4622 15.4263L17.5389 14.5083C15.6503 12.6581 13.426 11.5565 10.8799 11.2317L10.1804 11.1469ZM6.34177 14.0879L5.59676 14.0879L4.86489 13.0186L4.12863 14.0879L3.388 14.0879L4.44855 12.5891L3.45374 11.1648L4.19437 11.1648L4.86489 12.164L5.52664 11.1648L6.27604 11.1648L5.28122 12.5847L6.34177 14.0879Z" fill="currentColor"></path></svg>',g='<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>'}.apply(e,o))||(t.exports=n)},912:(t,e,i)=>{var o;void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(){this.removeStorage=t=>{try{localStorage.removeItem(t),localStorage.removeItem(`${t}_expiresIn`)}catch(e){return console.log(`removeStorage: Error removing key [${t}] from localStorage: ${JSON.stringify(e)}`),!1}return!0},this.getStorage=t=>{const e=Date.now();let i;try{i=localStorage.getItem(`${t}_expires`)}catch(t){return console.log(`getItem: error getting localStorage: ${JSON.stringify(t)}`),null}if(null==i&&(i=0),i<e)return this.removeStorage(t),null;try{return localStorage.getItem(t)}catch(e){return console.log(`getStorage: Error reading key [${t}] from localStorage: ${JSON.stringify(e)}`),null}},this.setStorage=(t,e,i=null)=>{i=i?Math.abs(i):86400;const o=Date.now()+1e3*i;try{localStorage.setItem(t,e),localStorage.setItem(`${t}_expires`,o.toString())}catch(e){return console.log(`setStorage: Error setting key [${t}] in localStorage: ${JSON.stringify(e)}`),!1}return!0}}}}.apply(e,[i,e]))||(t.exports=o)}},e={};!function i(o){var n=e[o];if(void 0!==n)return n.exports;var s=e[o]={exports:{}};return t[o].call(s.exports,s,s.exports,i),s.exports}(607)})();