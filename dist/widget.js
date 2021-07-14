(()=>{var t={913:(t,e,i)=>{var o;void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(){this.isEnvironmentValid=t=>this.environments.includes(t),this.setEnvironment=t=>{t&&this.isEnvironmentValid(t)&&(this.environment=t,t===this.environmentStaging?(this.apiUrl=this.apiUrlStaging,this.eventsUrl=this.eventsUrlStaging,this.hostUrl=this.hostUrlStaging):t===this.environmentLocal?(this.apiUrl=this.apiUrlLocal,this.eventsUrl=this.eventsUrlLocal,this.hostUrl=this.hostUrlLocal):t===this.environmentProduction&&(this.apiUrl=this.apiUrlProduction,this.eventsUrl=this.eventsUrlProduction,this.hostUrl=this.hostUrlProduction))},this.environmentLocal="local",this.environmentStaging="staging",this.environmentProduction="production",this.apiUrl="https://api.tonicpow.com",this.apiUrlLocal="http://localhost:3000",this.apiUrlStaging="https://api.staging.tonicpow.com",this.apiUrlProduction="https://api.tonicpow.com",this.eventsUrl="https://events.tonicpow.com",this.eventsUrlLocal="http://localhost:3002",this.eventsUrlStaging="https://events.staging.tonicpow.com",this.eventsUrlProduction="https://events.tonicpow.com",this.hostUrl="http://tonicpow.com",this.hostUrlLocal="http://localhost",this.hostUrlStaging="https://web.staging.tonicpow.com",this.hostUrlProduction="https://tonicpow.com",this.customEnvironmentAttribute="data-environment",this.environment="",this.environments=[this.environmentLocal,this.environmentStaging,this.environmentProduction],this.maxSessionDays=60,this.sessionParameterName="tncpw_session",this.challengeParameterName="tncpw_challenge",this.version="v0.0.12",this.widgetDivClass="tonicpow-widget",this.widgetIdAttribute="data-widget-id",this.fbAppId="293952358462196"}}}.apply(e,[i,e]))||(t.exports=o)},242:function(t,e,i){var o,n=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function r(t){try{c(o.next(t))}catch(t){s(t)}}function a(t){try{c(o.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}c((o=o.apply(t,e||[])).next())}))};void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(t="",e="",i){this.sendPing=()=>{setTimeout((()=>{this.sendEvent("ping",((new Date).getTime()-this.start).toString())}),4e3)},this.detectWidgetClick=()=>{document.addEventListener("click",(t=>n(this,void 0,void 0,(function*(){var e,i;const o=(t||window.event).target,n=null===(e=null==o?void 0:o.parentElement)||void 0===e?void 0:e.parentElement;if(null===(i=null==n?void 0:n.classList)||void 0===i?void 0:i.contains("tonicpow-widget"))try{yield this.sendEvent("widget_click",n.getAttribute(this.config.widgetIdAttribute)||"")}catch(t){console.error("failed to report interaction: widget_click",t)}}))))},this.detectBounce=()=>{window.onbeforeunload=()=>{this.sendEvent("bounce",((new Date).getTime()-this.start).toString())}},this.sendChallengeResponse=()=>{try{this.sendEvent("challenge",this.challengeGuid)}catch(t){console.error("Failed to send challenge response",t)}},this.detectInteraction=()=>{document.addEventListener("mousedown",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","mousedown")}catch(t){console.error("failed to report interaction: mousedown",t)}})))),document.addEventListener("scroll",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","scroll")}catch(t){console.error("failed to report interaction: scroll",t)}})))),document.addEventListener("keypress",(()=>n(this,void 0,void 0,(function*(){if(!this.interactionSent)try{this.interactionSent=!0,yield this.sendEvent("interaction","keypress")}catch(t){console.error("failed to report interaction: keypress",t)}}))))},this.sendEvent=(t,e)=>n(this,void 0,void 0,(function*(){if(!this.sessionId&&!this.challengeGuid)return void console.info("you must call init with a session before sending events");const i=window.location.href,o={v:this.config.version,name:t,location:i,data:e};this.sessionId&&(o.tncpw_session=this.sessionId),yield fetch(`${this.config.eventsUrl}/v1/events?d=${btoa(JSON.stringify(o))}`,{method:"get"})})),this.sessionId=t,this.config=i,this.challengeGuid=e,this.interactionSent=!1,this.start=(new Date).getTime(),this.challengeGuid&&this.challengeGuid.length>0?this.sendChallengeResponse():(this.detectInteraction(),this.detectBounce(),this.detectWidgetClick(),this.sendPing())}}}.apply(e,[i,e]))||(t.exports=o)},607:function(t,e,i){var o,n,s=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function r(t){try{c(o.next(t))}catch(t){s(t)}}function a(t){try{c(o.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}c((o=o.apply(t,e||[])).next())}))},r=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};o=[i,e,i(913),i(242),i(912)],void 0===(n=function(t,e,i,o,n){"use strict";var a;Object.defineProperty(e,"__esModule",{value:!0}),i=r(i),o=r(o),n=r(n),function(t){t.LinkedIn="linkedin",t.PowPing="powping",t.Twitter="twitter",t.Twetch="twetch",t.Facebook="facebook"}(a||(a={}));class c{constructor(t){this.setOreo=(t,e,i)=>{const o=new Date;o.setTime(o.getTime()+864e5*i),document.cookie=`${t}=${e};path=/;expires=${o.toUTCString()}`},this.captureVisitorSession=(t="",e="")=>{let i=t,o=e;const n=new URLSearchParams(window.location.search);return t&&t.length||"undefined"==typeof window||(i=n.get(this.config.sessionParameterName)||null),e&&e.length||"undefined"==typeof window||(o=n.get(this.config.challengeParameterName)||null),i&&i.length>0&&(this.setOreo(this.config.sessionParameterName,i,this.config.maxSessionDays),this.storage.setStorage(this.config.sessionParameterName,i,86400*this.config.maxSessionDays)),o&&o.length>0&&this.storage.setStorage(this.config.challengeParameterName,o,60),{sessionId:i,challengeGuid:o}},this.getVisitorSession=()=>this.storage.getStorage(this.config.sessionParameterName),this.loadDivs=()=>s(this,void 0,void 0,(function*(){const t=document.getElementsByClassName(this.config.widgetDivClass);for(let e=t.length-1;e>=0;e--){const i=t[e];if(!i){console.log("exit early - remove this?");continue}const o=i.getAttribute(this.config.customEnvironmentAttribute);switch(this.config.setEnvironment(o||"production"),i.getAttribute("data-widget-type")){case"share-button":this.initializeButton(i);break;case"banner":default:yield this.initializeBanner(i)}}})),this.getDataAttributes=function(t){const e={};return[].forEach.call(t.attributes,(function(t){if(/^data-/.test(t.name)){const i=t.name.substr(5).replace(/-(.)/g,(function(t,e){return e.toUpperCase()}));e[i]=t.value}})),e},this.shareButton=(t,e)=>{this.shareButtons.set(t,e)},this.shareOnPlatform=(t,e)=>{const i=`Check this out 😎 ${t.title} - ${t.short_link_url}`;switch(e){case a.Facebook:window.open(`https://www.facebook.com/dialog/share?quote=${t.title}&hashtag=ad&href=${t.short_link_url}&display=popup&app_id=${this.config.fbAppId}`);break;case a.LinkedIn:window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${t.short_link_url}&title=${t.title}&description=${i}`);break;case a.PowPing:window.open(`https://powping.com/?text=${i}`,"_blank");break;case a.Twetch:window.open(`https://twetch.app/compose?description=${i}`,"_blank");break;case a.Twitter:window.open(`https://twitter.com/intent/tweet?text=${i}`,"_blank")}},this.copyText=t=>{const e=document.getElementById("tonicpow-widget-popup");if(e){const i=document.createElement("textarea");i.innerHTML=t,e.appendChild(i),i.select();const o=document.execCommand("copy");if(e.removeChild(i),o){const t=document.getElementById("tonicpow__short-link-text");if(t){const e=t.innerHTML;t.innerHTML="Copied!",setTimeout((()=>{t.innerHTML=e}),3e3)}}}},this.closePopup=()=>{const t=document.getElementById("tonicpow-widget-popup");t&&t.remove()},this.load=()=>s(this,void 0,void 0,(function*(){if("undefined"==typeof window)return void console.error("TonicPow embed only works in the browser");const t=document.getElementsByClassName(this.config.widgetDivClass);if(t&&t.length>0)try{yield this.loadDivs(),console.log("%c TonicPow widget(s) loaded! ","background: #974CD2; color: #fff")}catch(t){throw t}const{sessionId:e,challengeGuid:i}=this.captureVisitorSession();(e||i)&&(this.events=new o.default(e||"",i||"",this.config))})),this.config=new i.default,this.storage=new n.default,this.widgets=new Map,this.options=t,this.buttonViewsInitialized=!1,this.shareButtons=new Map,this.nrOfButtons=0,"complete"===document.readyState||"interactive"===document.readyState?this.load():document.addEventListener("DOMContentLoaded",(()=>{this.load()}))}initializeButton(t){const e=this.getDataAttributes(t);e.buttonId||(t.id="tonicpow-button-id-"+this.nrOfButtons++,e.buttonId=t.id);const i=this.shareButtons.get(e.buttonId)||{};for(const t in e)!e.hasOwnProperty(t)||i&&i.hasOwnProperty(t)||(i[t]=e[t]);let o="";for(const t in i)i.hasOwnProperty(t)&&"string"==typeof i[t]&&(o+=`&${t}=${i[t]}`);i.width||(i.width="150"),i.height||(i.height="50"),i.targetUrl||(i.targetUrl=encodeURIComponent(document.location.href)),this.shareButtons.set(e.buttonId,i),t.innerHTML=`\n      <iframe\n        src='${this.config.hostUrl}/share_button.html?targetUrl=${i.targetUrl}${o}'\n        class='tonicpow-widget-share-button'\n        width='${i.width}'\n        height='${i.height}'\n      />`,this.initializeButtonViews()}initializeButtonViews(){if(!this.buttonViewsInitialized){const t="\n          * { clear: all }\n          .tonicpow-icon { width: 1.5rem; height: 1.5rem; cursor: pointer; margin: auto; }\n          .tonicpow-icon > object { pointer-events: none; }\n          .tonicpow-widget-share-button { border: none; }\n          .tonicpow-widget-share-button > iframe { overflow: hidden; }\n          .tonicpow-modal { font-family: Nunito, Arial; display: flex; align-items: center; padding: 0 1em; text-align: center; width: 100%; height: 100%; position: fixed; top: 0; left: 0; }\n          .tonicpow-modal__overlay { background: black; bottom: 0; left: 0; position: fixed; right: 0; text-align: center; top: 0; z-index: -800; opacity: 0.5; }\n          .tonicpow-modal__box { padding: 25px; position: relative; margin: 1em auto; max-width: 500px; width: 90%; background-color: #fff; border-radius: 12px; }\n          .tonicpow-modal__box > h2 { margin-top: 0; text-align: left; }\n          .tonicpow-modal__box > h2 > .tonicpow-modal__close { float: right; cursor: pointer; }\n          .tonicpow-modal__box > .tonicpow-modal__grid { padding: 2rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }\n          .tonicpow-modal__box > .tonicpow-modal__campaign { position: relative; border: 1px solid #f2f2f2; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_title { display: flex; justify-content: center; align-items: center; position: absolute; border-radius: 0 0 .5rem .5rem; background: rgba(0,0,0,.5); left: 0; color: white; bottom: 0; width: 100%; height: 2rem; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > .tonicpow-modal__campaign_ppc { position: absolute; background: rgba(0,200,0,.5); right: .5rem; color: white; top: .5rem; }\n          .tonicpow-modal__box > .tonicpow-modal__campaign > img { display: block; border-radius: .5rem; width: 100% }\n          ",e=document.createElement("style");e.appendChild(document.createTextNode(t)),document.head.appendChild(e),this.buttonViewsInitialized=!0,window.addEventListener("message",(t=>{if(t.data&&t.data.buttonId&&"tonicpow"===t.data.source){const e=this.shareButtons.get(t.data.buttonId)||{};t.data.error?e.hasOwnProperty("onError")&&"function"==typeof e.onError?e.onError(t.data):c.showPopup({title:"ERROR: "+t.data.error,shortLink:t.data.message}):e.hasOwnProperty("onSuccess")&&"function"==typeof e.onSuccess?e.onSuccess(t.data):c.showPopup({title:"Share & Earn",shortLink:t.data.shortLink})}}))}}static showPopup(t){var e,i,o,n,s;const r=`${window.TonicPow.config.hostUrl}/images/icons/copyIcon.svg`,c=`${window.TonicPow.config.hostUrl}/images/icons/facebookIcon.svg`,l=`${window.TonicPow.config.hostUrl}/images/icons/twitterIcon.svg`,d=`${window.TonicPow.config.hostUrl}/images/icons/twetchIcon.svg`,h=`${window.TonicPow.config.hostUrl}/images/icons/closeIcon.svg`,p=`${window.TonicPow.config.hostUrl}/images/image_placeholder_tonicpow.png`,u=document.createElement("div");u.id="tonicpow-widget-popup",u.classList.add("tonicpow-modal");const g=document.createElement("div");g.classList.add("tonicpow-modal__grid");const m=document.createElement("div");m.classList.add("tonicpow-icon"),m.onclick=()=>{var e;return window.TonicPow.copyText(null===(e=t.shortLink)||void 0===e?void 0:e.short_link_url)};const w=document.createElement("object");w.setAttribute("data",r),w.setAttribute("width","24"),w.setAttribute("height","24"),m.appendChild(w);const f=document.createElement("div");f.classList.add("tonicpow-icon"),f.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Facebook);const v=document.createElement("object");v.setAttribute("data",c),v.setAttribute("width","24"),v.setAttribute("height","24"),f.appendChild(v);const b=document.createElement("div");b.classList.add("tonicpow-icon"),b.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Twitter);const _=document.createElement("object");_.setAttribute("data",l),_.setAttribute("width","24"),_.setAttribute("height","24"),b.appendChild(_);const y=document.createElement("div");y.classList.add("tonicpow-icon"),y.onclick=()=>window.TonicPow.shareOnPlatform(t.shortLink,a.Twetch);const k=document.createElement("object");k.setAttribute("data",d),k.setAttribute("width","24"),k.setAttribute("height","24"),y.appendChild(k),g.appendChild(y),g.appendChild(b),g.appendChild(f),g.appendChild(m);const P=document.createElement("div");P.classList.add("tonicpow-modal__box"),P.innerHTML=`\n      <h2>\n        ${t.title}\n        <div class="tonicpow-modal__close tonicpow-icon" onclick="TonicPow.closePopup();">\n          <object data="${h}"></object>\n        </div>\n      </h2>\n      <div class="tonicpow-modal__campaign">\n        <img class="tonicpow-modal__campaign_image" src="${(null===(i=null===(e=t.shortLink)||void 0===e?void 0:e.image_url)||void 0===i?void 0:i.length)?null===(o=t.shortLink)||void 0===o?void 0:o.image_url:p}" />\n        <div class="tonicpow-modal__campaign_title">${(null===(n=t.shortLink)||void 0===n?void 0:n.title.length)?t.shortLink.title:"TonicPow Campaign"}</div>\n      </div>\n      <p id="tonicpow__short-link-text">${null===(s=t.shortLink)||void 0===s?void 0:s.short_link_url}</p>      \n\n  `,P.appendChild(g),u.innerHTML='<div>\n        <div class="tonicpow-modal__overlay" onclick="TonicPow.closePopup();"></div>\n      </div>\n    ',u.appendChild(P),document.body.appendChild(u)}initializeBanner(t){return s(this,void 0,void 0,(function*(){const e=t.getAttribute(this.config.widgetIdAttribute);if(e){this.widgets.set(e,null);try{const i=yield fetch(`${this.config.apiUrl}/v1/widgets/display/${e}?provider=embed-${this.config.version}`);let o;403===i.status?(console.info(`${i.status}: Domain not allowed`),o={link_url:this.config.hostUrl,image_url:`${this.config.hostUrl}/images/widgetFallback.svg`}):o=yield i.json();const n=encodeURIComponent(o.title);t.innerHTML=`\n      <a href='${o.link_url}?utm_source=tonicpow-widgets&utm_medium=widget&utm_campaign=${e}&utm_content=${n}' style='display: inline-block'>\n        <img src='${o.image_url}' \n          width='${o.width}' \n          height='${o.height}' \n          alt='${o.title}'\n          loading='lazy' />\n      </a>`,t.setAttribute("data-width",o.width),t.setAttribute("data-height",o.height),this.widgets.set(e,o),this.options&&this.options.onWidgetLoaded&&(o.id=e,this.options.onWidgetLoaded(o))}catch(t){throw t}}else console.log(`${e} not found`)}))}}e.default=c;const l=new c;window.TonicPow=l||{}}.apply(e,o))||(t.exports=n)},912:(t,e,i)=>{var o;void 0===(o=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(){this.removeStorage=t=>{try{localStorage.removeItem(t),localStorage.removeItem(`${t}_expiresIn`)}catch(e){return console.log(`removeStorage: Error removing key [${t}] from localStorage: ${JSON.stringify(e)}`),!1}return!0},this.getStorage=t=>{const e=Date.now();let i;try{i=localStorage.getItem(`${t}_expires`)}catch(t){return console.log(`getItem: error getting localStorage: ${JSON.stringify(t)}`),null}if(null==i&&(i=0),i<e)return this.removeStorage(t),null;try{return localStorage.getItem(t)}catch(e){return console.log(`getStorage: Error reading key [${t}] from localStorage: ${JSON.stringify(e)}`),null}},this.setStorage=(t,e,i=null)=>{i=i?Math.abs(i):86400;const o=Date.now()+1e3*i;try{localStorage.setItem(t,e),localStorage.setItem(`${t}_expires`,o.toString())}catch(e){return console.log(`setStorage: Error setting key [${t}] in localStorage: ${JSON.stringify(e)}`),!1}return!0}}}}.apply(e,[i,e]))||(t.exports=o)}},e={};!function i(o){var n=e[o];if(void 0!==n)return n.exports;var s=e[o]={exports:{}};return t[o].call(s.exports,s,s.exports,i),s.exports}(607)})();