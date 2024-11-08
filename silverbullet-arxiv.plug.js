var P=Object.defineProperty;var x=(e,r)=>{for(var n in r)P(e,n,{get:r[n],enumerable:!0})};var m=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var l=new Map,c=0;function a(e){self.postMessage(e)}m&&(globalThis.syscall=async(e,...r)=>await new Promise((n,o)=>{c++,l.set(c,{resolve:n,reject:o}),a({type:"sys",id:c,name:e,args:r})}));function d(e,r){m&&(self.addEventListener("message",n=>{(async()=>{let o=n.data;switch(o.type){case"inv":{let i=e[o.name];if(!i)throw new Error(`Function not loaded: ${o.name}`);try{let s=await Promise.resolve(i(...o.args||[]));a({type:"invr",id:o.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",o.name,"error:",s.message),a({type:"invr",id:o.id,error:s.message})}}break;case"sysr":{let i=o.id,s=l.get(i);if(!s)throw Error("Invalid request id");l.delete(i),o.error?s.reject(new Error(o.error)):s.resolve(o.result)}break}})().catch(console.error)}),a({type:"manifest",manifest:r}))}function h(e){let r=atob(e),n=r.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=r.charCodeAt(i);return o}function p(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let r="",n=e.byteLength;for(let o=0;o<n;o++)r+=String.fromCharCode(e[o]);return btoa(r)}async function v(e,r){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?p(n):void 0;r={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,r)}globalThis.nativeFetch=globalThis.fetch;function b(){globalThis.fetch=async function(e,r){let n=r&&r.body?p(new Uint8Array(await new Response(r.body).arrayBuffer())):void 0,o=await v(e,r&&{method:r.method,headers:r.headers,base64Body:n});return new Response(o.base64Body?h(o.base64Body):null,{status:o.status,headers:o.headers})}}m&&b();var u={};x(u,{confirm:()=>z,copyToClipboard:()=>ae,deleteLine:()=>ue,dispatch:()=>G,downloadFile:()=>q,filterBox:()=>j,flashNotification:()=>O,fold:()=>Z,foldAll:()=>re,getCurrentPage:()=>A,getCursor:()=>S,getSelection:()=>F,getText:()=>w,getUiOption:()=>J,goHistory:()=>L,hidePanel:()=>N,insertAtCursor:()=>$,insertAtPos:()=>V,moveCursor:()=>I,moveCursorToLine:()=>_,navigate:()=>U,openCommandPalette:()=>R,openPageNavigator:()=>k,openSearchPanel:()=>se,openUrl:()=>W,prompt:()=>Y,redo:()=>ie,reloadConfigAndCommands:()=>D,reloadPage:()=>E,reloadUI:()=>K,replaceRange:()=>H,save:()=>T,setSelection:()=>M,setText:()=>C,setUiOption:()=>X,showPanel:()=>Q,toggleFold:()=>te,undo:()=>ne,unfold:()=>ee,unfoldAll:()=>oe,uploadFile:()=>B,vimEx:()=>ce});typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});function t(e,...r){return globalThis.syscall(e,...r)}function A(){return t("editor.getCurrentPage")}function w(){return t("editor.getText")}function C(e){return t("editor.setText",e)}function S(){return t("editor.getCursor")}function F(){return t("editor.getSelection")}function M(e,r){return t("editor.setSelection",e,r)}function T(){return t("editor.save")}function U(e,r=!1,n=!1){return t("editor.navigate",e,r,n)}function k(e="page"){return t("editor.openPageNavigator",e)}function R(){return t("editor.openCommandPalette")}function E(){return t("editor.reloadPage")}function K(){return t("editor.reloadUI")}function D(){return t("editor.reloadConfigAndCommands")}function W(e,r=!1){return t("editor.openUrl",e,r)}function L(e){return t("editor.goHistory",e)}function q(e,r){return t("editor.downloadFile",e,r)}function B(e,r){return t("editor.uploadFile",e,r)}function O(e,r="info"){return t("editor.flashNotification",e,r)}function j(e,r,n="",o=""){return t("editor.filterBox",e,r,n,o)}function Q(e,r,n,o=""){return t("editor.showPanel",e,r,n,o)}function N(e){return t("editor.hidePanel",e)}function V(e,r){return t("editor.insertAtPos",e,r)}function H(e,r,n){return t("editor.replaceRange",e,r,n)}function I(e,r=!1){return t("editor.moveCursor",e,r)}function _(e,r=1,n=!1){return t("editor.moveCursorToLine",e,r,n)}function $(e){return t("editor.insertAtCursor",e)}function G(e){return t("editor.dispatch",e)}function Y(e,r=""){return t("editor.prompt",e,r)}function z(e){return t("editor.confirm",e)}function J(e){return t("editor.getUiOption",e)}function X(e,r){return t("editor.setUiOption",e,r)}function Z(){return t("editor.fold")}function ee(){return t("editor.unfold")}function te(){return t("editor.toggleFold")}function re(){return t("editor.foldAll")}function oe(){return t("editor.unfoldAll")}function ne(){return t("editor.undo")}function ie(){return t("editor.redo")}function se(){return t("editor.openSearchPanel")}function ae(e){return t("editor.copyToClipboard",e)}function ue(){return t("editor.deleteLine")}function ce(e){return t("editor.vimEx",e)}async function f(){await u.flashNotification("Hello world!")}var g={helloWorld:f},y={name:"silverbullet-arxiv",functions:{helloWorld:{path:"silverbullet-arxiv.ts:helloWorld",command:{name:"Say hello"}}},assets:{}},tt={manifest:y,functionMapping:g};d(g,y);export{tt as plug};
