(self.webpackChunkdiscrelog=self.webpackChunkdiscrelog||[]).push([[191],{7865:(e,t,r)=>{"use strict";r.d(t,{PD:()=>L});var n={};function o(e){var t=null;return function(){return null==t&&(t=e()),t}}function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}r.r(n),r.d(n,{FILE:()=>f,HTML:()=>m,TEXT:()=>p,URL:()=>h});var i=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.entered=[],this.isNodeInDocument=t}var t,r;return t=e,(r=[{key:"enter",value:function(e){var t=this,r=this.entered.length;return this.entered=function(e,t){var r=new Set,n=function(e){return r.add(e)};e.forEach(n),t.forEach(n);var o=[];return r.forEach((function(e){return o.push(e)})),o}(this.entered.filter((function(r){return t.isNodeInDocument(r)&&(!r.contains||r.contains(e))})),[e]),0===r&&this.entered.length>0}},{key:"leave",value:function(e){var t,r,n=this.entered.length;return this.entered=(t=this.entered.filter(this.isNodeInDocument),r=e,t.filter((function(e){return e!==r}))),n>0&&0===this.entered.length}},{key:"reset",value:function(){this.entered=[]}}])&&a(t.prototype,r),e}(),s=o((function(){return/firefox/i.test(navigator.userAgent)})),u=o((function(){return Boolean(window.safari)}));function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var d=function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);for(var n=t.length,o=[],a=0;a<n;a++)o.push(a);o.sort((function(e,r){return t[e]<t[r]?-1:1}));for(var i,s,u=[],c=[],d=[],l=0;l<n-1;l++)i=t[l+1]-t[l],s=r[l+1]-r[l],c.push(i),u.push(s),d.push(s/i);for(var g=[d[0]],v=0;v<c.length-1;v++){var f=d[v],h=d[v+1];if(f*h<=0)g.push(0);else{i=c[v];var p=c[v+1],m=i+p;g.push(3*m/((m+p)/f+(m+i)/h))}}g.push(d[d.length-1]);for(var D,y=[],T=[],E=0;E<g.length-1;E++){D=d[E];var w=g[E],b=1/c[E],N=w+g[E+1]-D-D;y.push((D-w-N)*b),T.push(N*b*b)}this.xs=t,this.ys=r,this.c1s=g,this.c2s=y,this.c3s=T}var t,r;return t=e,(r=[{key:"interpolate",value:function(e){var t=this.xs,r=this.ys,n=this.c1s,o=this.c2s,a=this.c3s,i=t.length-1;if(e===t[i])return r[i];for(var s,u=0,c=a.length-1;u<=c;){var d=t[s=Math.floor(.5*(u+c))];if(d<e)u=s+1;else{if(!(d>e))return r[s];c=s-1}}var l=e-t[i=Math.max(0,c)],g=l*l;return r[i]+n[i]*l+o[i]*g+a[i]*l*g}}])&&c(t.prototype,r),e}();function l(e){var t=1===e.nodeType?e:e.parentElement;if(!t)return null;var r=t.getBoundingClientRect(),n=r.top;return{x:r.left,y:n}}function g(e){return{x:e.clientX,y:e.clientY}}var v,f="__NATIVE_FILE__",h="__NATIVE_URL__",p="__NATIVE_TEXT__",m="__NATIVE_HTML__";function D(e,t,r){var n=t.reduce((function(t,r){return t||e.getData(r)}),"");return null!=n?n:r}function y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var T=(y(v={},f,{exposeProperties:{files:function(e){return Array.prototype.slice.call(e.files)},items:function(e){return e.items}},matchesTypes:["Files"]}),y(v,m,{exposeProperties:{html:function(e,t){return D(e,t,"")}},matchesTypes:["Html","text/html"]}),y(v,h,{exposeProperties:{urls:function(e,t){return D(e,t,"").split("\n")}},matchesTypes:["Url","text/uri-list"]}),y(v,p,{exposeProperties:{text:function(e,t){return D(e,t,"")}},matchesTypes:["Text","text/plain"]}),v);function E(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var w=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.config=t,this.item={},this.initializeExposedProperties()}var t,r;return t=e,(r=[{key:"initializeExposedProperties",value:function(){var e=this;Object.keys(this.config.exposeProperties).forEach((function(t){Object.defineProperty(e.item,t,{configurable:!0,enumerable:!0,get:function(){return console.warn("Browser doesn't allow reading \"".concat(t,'" until the drop event.')),null}})}))}},{key:"loadDataTransfer",value:function(e){var t=this;if(e){var r={};Object.keys(this.config.exposeProperties).forEach((function(n){r[n]={value:t.config.exposeProperties[n](e,t.config.matchesTypes),configurable:!0,enumerable:!0}})),Object.defineProperties(this.item,r)}}},{key:"canDrag",value:function(){return!0}},{key:"beginDrag",value:function(){return this.item}},{key:"isDragging",value:function(e,t){return t===e.getSourceId()}},{key:"endDrag",value:function(){}}])&&E(t.prototype,r),e}();function b(e){if(!e)return null;var t=Array.prototype.slice.call(e.types||[]);return Object.keys(T).filter((function(e){return T[e].matchesTypes.some((function(e){return t.indexOf(e)>-1}))}))[0]||null}function N(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var S=function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.ownerDocument=null,this.globalContext=t,this.optionsArgs=r}var t,r;return t=e,(r=[{key:"window",get:function(){return this.globalContext?this.globalContext:"undefined"!=typeof window?window:void 0}},{key:"document",get:function(){var e;return null!==(e=this.globalContext)&&void 0!==e&&e.document?this.globalContext.document:this.window?this.window.document:void 0}},{key:"rootElement",get:function(){var e;return(null===(e=this.optionsArgs)||void 0===e?void 0:e.rootElement)||this.window}}])&&N(t.prototype,r),e}();function O(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function I(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?O(Object(r),!0).forEach((function(t){C(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):O(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function C(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function P(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var k=function(){function e(t,r,n){var o=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.sourcePreviewNodes=new Map,this.sourcePreviewNodeOptions=new Map,this.sourceNodes=new Map,this.sourceNodeOptions=new Map,this.dragStartSourceIds=null,this.dropTargetIds=[],this.dragEnterTargetIds=[],this.currentNativeSource=null,this.currentNativeHandle=null,this.currentDragSourceNode=null,this.altKeyPressed=!1,this.mouseMoveTimeoutTimer=null,this.asyncEndDragFrameId=null,this.dragOverTargetIds=null,this.getSourceClientOffset=function(e){var t=o.sourceNodes.get(e);return t&&l(t)||null},this.endDragNativeItem=function(){o.isDraggingNativeItem()&&(o.actions.endDrag(),o.currentNativeHandle&&o.registry.removeSource(o.currentNativeHandle),o.currentNativeHandle=null,o.currentNativeSource=null)},this.isNodeInDocument=function(e){return Boolean(e&&o.document&&o.document.body&&document.body.contains(e))},this.endDragIfSourceWasRemovedFromDOM=function(){var e=o.currentDragSourceNode;null==e||o.isNodeInDocument(e)||o.clearCurrentDragSourceNode()&&o.monitor.isDragging()&&o.actions.endDrag()},this.handleTopDragStartCapture=function(){o.clearCurrentDragSourceNode(),o.dragStartSourceIds=[]},this.handleTopDragStart=function(e){if(!e.defaultPrevented){var t=o.dragStartSourceIds;o.dragStartSourceIds=null;var r=g(e);o.monitor.isDragging()&&o.actions.endDrag(),o.actions.beginDrag(t||[],{publishSource:!1,getSourceClientOffset:o.getSourceClientOffset,clientOffset:r});var n=e.dataTransfer,a=b(n);if(o.monitor.isDragging()){if(n&&"function"==typeof n.setDragImage){var i=o.monitor.getSourceId(),c=o.sourceNodes.get(i),v=o.sourcePreviewNodes.get(i)||c;if(v){var f=o.getCurrentSourcePreviewNodeOptions(),h=function(e,t,r,n,o){var a,i,c,g="IMG"===(a=t).nodeName&&(s()||!(null!==(i=document.documentElement)&&void 0!==i&&i.contains(a))),v=l(g?e:t),f={x:r.x-v.x,y:r.y-v.y},h=e.offsetWidth,p=e.offsetHeight,m=n.anchorX,D=n.anchorY,y=function(e,t,r,n){var o=e?t.width:r,a=e?t.height:n;return u()&&e&&(a/=window.devicePixelRatio,o/=window.devicePixelRatio),{dragPreviewWidth:o,dragPreviewHeight:a}}(g,t,h,p),T=y.dragPreviewWidth,E=y.dragPreviewHeight,w=o.offsetX,b=o.offsetY,N=0===b||b;return{x:0===w||w?w:new d([0,.5,1],[f.x,f.x/h*T,f.x+T-h]).interpolate(m),y:N?b:(c=new d([0,.5,1],[f.y,f.y/p*E,f.y+E-p]).interpolate(D),u()&&g&&(c+=(window.devicePixelRatio-1)*E),c)}}(c,v,r,{anchorX:f.anchorX,anchorY:f.anchorY},{offsetX:f.offsetX,offsetY:f.offsetY});n.setDragImage(v,h.x,h.y)}}try{null==n||n.setData("application/json",{})}catch(e){}o.setCurrentDragSourceNode(e.target),o.getCurrentSourcePreviewNodeOptions().captureDraggingState?o.actions.publishDragSource():setTimeout((function(){return o.actions.publishDragSource()}),0)}else if(a)o.beginDragNativeItem(a);else{if(n&&!n.types&&(e.target&&!e.target.hasAttribute||!e.target.hasAttribute("draggable")))return;e.preventDefault()}}},this.handleTopDragEndCapture=function(){o.clearCurrentDragSourceNode()&&o.monitor.isDragging()&&o.actions.endDrag()},this.handleTopDragEnterCapture=function(e){if(o.dragEnterTargetIds=[],o.enterLeaveCounter.enter(e.target)&&!o.monitor.isDragging()){var t=e.dataTransfer,r=b(t);r&&o.beginDragNativeItem(r,t)}},this.handleTopDragEnter=function(e){var t=o.dragEnterTargetIds;o.dragEnterTargetIds=[],o.monitor.isDragging()&&(o.altKeyPressed=e.altKey,t.length>0&&o.actions.hover(t,{clientOffset:g(e)}),t.some((function(e){return o.monitor.canDropOnTarget(e)}))&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=o.getCurrentDropEffect())))},this.handleTopDragOverCapture=function(){o.dragOverTargetIds=[]},this.handleTopDragOver=function(e){var t=o.dragOverTargetIds;if(o.dragOverTargetIds=[],!o.monitor.isDragging())return e.preventDefault(),void(e.dataTransfer&&(e.dataTransfer.dropEffect="none"));o.altKeyPressed=e.altKey,o.actions.hover(t||[],{clientOffset:g(e)}),(t||[]).some((function(e){return o.monitor.canDropOnTarget(e)}))?(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=o.getCurrentDropEffect())):o.isDraggingNativeItem()?e.preventDefault():(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="none"))},this.handleTopDragLeaveCapture=function(e){o.isDraggingNativeItem()&&e.preventDefault(),o.enterLeaveCounter.leave(e.target)&&o.isDraggingNativeItem()&&setTimeout((function(){return o.endDragNativeItem()}),0)},this.handleTopDropCapture=function(e){var t;o.dropTargetIds=[],o.isDraggingNativeItem()&&(e.preventDefault(),null===(t=o.currentNativeSource)||void 0===t||t.loadDataTransfer(e.dataTransfer)),o.enterLeaveCounter.reset()},this.handleTopDrop=function(e){var t=o.dropTargetIds;o.dropTargetIds=[],o.actions.hover(t,{clientOffset:g(e)}),o.actions.drop({dropEffect:o.getCurrentDropEffect()}),o.isDraggingNativeItem()?o.endDragNativeItem():o.monitor.isDragging()&&o.actions.endDrag()},this.handleSelectStart=function(e){var t=e.target;"function"==typeof t.dragDrop&&("INPUT"===t.tagName||"SELECT"===t.tagName||"TEXTAREA"===t.tagName||t.isContentEditable||(e.preventDefault(),t.dragDrop()))},this.options=new S(r,n),this.actions=t.getActions(),this.monitor=t.getMonitor(),this.registry=t.getRegistry(),this.enterLeaveCounter=new i(this.isNodeInDocument)}var t,r;return t=e,(r=[{key:"profile",value:function(){var e,t;return{sourcePreviewNodes:this.sourcePreviewNodes.size,sourcePreviewNodeOptions:this.sourcePreviewNodeOptions.size,sourceNodeOptions:this.sourceNodeOptions.size,sourceNodes:this.sourceNodes.size,dragStartSourceIds:(null===(e=this.dragStartSourceIds)||void 0===e?void 0:e.length)||0,dropTargetIds:this.dropTargetIds.length,dragEnterTargetIds:this.dragEnterTargetIds.length,dragOverTargetIds:(null===(t=this.dragOverTargetIds)||void 0===t?void 0:t.length)||0}}},{key:"window",get:function(){return this.options.window}},{key:"document",get:function(){return this.options.document}},{key:"rootElement",get:function(){return this.options.rootElement}},{key:"setup",value:function(){var e=this.rootElement;if(void 0!==e){if(e.__isReactDndBackendSetUp)throw new Error("Cannot have two HTML5 backends at the same time.");e.__isReactDndBackendSetUp=!0,this.addEventListeners(e)}}},{key:"teardown",value:function(){var e,t=this.rootElement;void 0!==t&&(t.__isReactDndBackendSetUp=!1,this.removeEventListeners(this.rootElement),this.clearCurrentDragSourceNode(),this.asyncEndDragFrameId&&(null===(e=this.window)||void 0===e||e.cancelAnimationFrame(this.asyncEndDragFrameId)))}},{key:"connectDragPreview",value:function(e,t,r){var n=this;return this.sourcePreviewNodeOptions.set(e,r),this.sourcePreviewNodes.set(e,t),function(){n.sourcePreviewNodes.delete(e),n.sourcePreviewNodeOptions.delete(e)}}},{key:"connectDragSource",value:function(e,t,r){var n=this;this.sourceNodes.set(e,t),this.sourceNodeOptions.set(e,r);var o=function(t){return n.handleDragStart(t,e)},a=function(e){return n.handleSelectStart(e)};return t.setAttribute("draggable","true"),t.addEventListener("dragstart",o),t.addEventListener("selectstart",a),function(){n.sourceNodes.delete(e),n.sourceNodeOptions.delete(e),t.removeEventListener("dragstart",o),t.removeEventListener("selectstart",a),t.setAttribute("draggable","false")}}},{key:"connectDropTarget",value:function(e,t){var r=this,n=function(t){return r.handleDragEnter(t,e)},o=function(t){return r.handleDragOver(t,e)},a=function(t){return r.handleDrop(t,e)};return t.addEventListener("dragenter",n),t.addEventListener("dragover",o),t.addEventListener("drop",a),function(){t.removeEventListener("dragenter",n),t.removeEventListener("dragover",o),t.removeEventListener("drop",a)}}},{key:"addEventListeners",value:function(e){e.addEventListener&&(e.addEventListener("dragstart",this.handleTopDragStart),e.addEventListener("dragstart",this.handleTopDragStartCapture,!0),e.addEventListener("dragend",this.handleTopDragEndCapture,!0),e.addEventListener("dragenter",this.handleTopDragEnter),e.addEventListener("dragenter",this.handleTopDragEnterCapture,!0),e.addEventListener("dragleave",this.handleTopDragLeaveCapture,!0),e.addEventListener("dragover",this.handleTopDragOver),e.addEventListener("dragover",this.handleTopDragOverCapture,!0),e.addEventListener("drop",this.handleTopDrop),e.addEventListener("drop",this.handleTopDropCapture,!0))}},{key:"removeEventListeners",value:function(e){e.removeEventListener&&(e.removeEventListener("dragstart",this.handleTopDragStart),e.removeEventListener("dragstart",this.handleTopDragStartCapture,!0),e.removeEventListener("dragend",this.handleTopDragEndCapture,!0),e.removeEventListener("dragenter",this.handleTopDragEnter),e.removeEventListener("dragenter",this.handleTopDragEnterCapture,!0),e.removeEventListener("dragleave",this.handleTopDragLeaveCapture,!0),e.removeEventListener("dragover",this.handleTopDragOver),e.removeEventListener("dragover",this.handleTopDragOverCapture,!0),e.removeEventListener("drop",this.handleTopDrop),e.removeEventListener("drop",this.handleTopDropCapture,!0))}},{key:"getCurrentSourceNodeOptions",value:function(){var e=this.monitor.getSourceId(),t=this.sourceNodeOptions.get(e);return I({dropEffect:this.altKeyPressed?"copy":"move"},t||{})}},{key:"getCurrentDropEffect",value:function(){return this.isDraggingNativeItem()?"copy":this.getCurrentSourceNodeOptions().dropEffect}},{key:"getCurrentSourcePreviewNodeOptions",value:function(){var e=this.monitor.getSourceId();return I({anchorX:.5,anchorY:.5,captureDraggingState:!1},this.sourcePreviewNodeOptions.get(e)||{})}},{key:"isDraggingNativeItem",value:function(){var e=this.monitor.getItemType();return Object.keys(n).some((function(t){return n[t]===e}))}},{key:"beginDragNativeItem",value:function(e,t){this.clearCurrentDragSourceNode(),this.currentNativeSource=function(e,t){var r=new w(T[e]);return r.loadDataTransfer(t),r}(e,t),this.currentNativeHandle=this.registry.addSource(e,this.currentNativeSource),this.actions.beginDrag([this.currentNativeHandle])}},{key:"setCurrentDragSourceNode",value:function(e){var t=this;this.clearCurrentDragSourceNode(),this.currentDragSourceNode=e,this.mouseMoveTimeoutTimer=setTimeout((function(){var e;return null===(e=t.rootElement)||void 0===e?void 0:e.addEventListener("mousemove",t.endDragIfSourceWasRemovedFromDOM,!0)}),1e3)}},{key:"clearCurrentDragSourceNode",value:function(){var e;return!!this.currentDragSourceNode&&(this.currentDragSourceNode=null,this.rootElement&&(null===(e=this.window)||void 0===e||e.clearTimeout(this.mouseMoveTimeoutTimer||void 0),this.rootElement.removeEventListener("mousemove",this.endDragIfSourceWasRemovedFromDOM,!0)),this.mouseMoveTimeoutTimer=null,!0)}},{key:"handleDragStart",value:function(e,t){e.defaultPrevented||(this.dragStartSourceIds||(this.dragStartSourceIds=[]),this.dragStartSourceIds.unshift(t))}},{key:"handleDragEnter",value:function(e,t){this.dragEnterTargetIds.unshift(t)}},{key:"handleDragOver",value:function(e,t){null===this.dragOverTargetIds&&(this.dragOverTargetIds=[]),this.dragOverTargetIds.unshift(t)}},{key:"handleDrop",value:function(e,t){this.dropTargetIds.unshift(t)}}])&&P(t.prototype,r),e}(),L=function(e,t,r){return new k(e,t,r)}}}]);
//# sourceMappingURL=npm.react-dnd-html5-backend.1b4376c4761b89d31662.bundle.js.map