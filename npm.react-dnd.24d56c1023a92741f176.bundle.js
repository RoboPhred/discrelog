(self.webpackChunkdiscrelog=self.webpackChunkdiscrelog||[]).push([[90],{94147:(e,t,n)=>{"use strict";n.d(t,{L:()=>i,W:()=>a});var r=n(67294),o=n(74808),i=r.createContext({dragDropManager:void 0});function a(e,t,n,r){return{dragDropManager:(0,o.i)(e,t,n,r)}}},24974:(e,t,n)=>{"use strict";n.d(t,{r:()=>a});var r=n(15047),o=n(67294),i=n(48586);function a(e,t,n){var a,u,c=(a=(0,o.useState)((function(){return t(e)})),u=2,function(e){if(Array.isArray(e))return e}(a)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(a,u)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),s=c[0],l=c[1],d=(0,o.useCallback)((function(){var o=t(e);(0,r.w)(s,o)||(l(o),n&&n())}),[s,e,n]);return(0,i.L)(d,[]),[s,d]}},75795:(e,t,n)=>{"use strict";n.d(t,{N:()=>a});var r=n(67294),o=n(28195),i=n(94147);function a(){var e=(0,r.useContext)(i.L).dragDropManager;return(0,o.k)(null!=e,"Expected drag drop context"),e}},48586:(e,t,n)=>{"use strict";n.d(t,{L:()=>o});var r=n(67294),o="undefined"!=typeof window?r.useLayoutEffect:r.useEffect},79336:(e,t,n)=>{"use strict";n.d(t,{f:()=>a});var r=n(67294),o=n(75795),i=n(24974);function a(e){var t,n,a=(0,o.N)().getMonitor(),u=(t=(0,i.r)(a,e),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),c=u[0],s=u[1];return(0,r.useEffect)((function(){return a.subscribeToOffsetChange(s)})),(0,r.useEffect)((function(){return a.subscribeToStateChange(s)})),c}},92705:(e,t,n)=>{"use strict";n.r(t),n.d(t,{DndContext:()=>r.L,DndProvider:()=>a,DragLayer:()=>Oe,DragPreviewImage:()=>s,DragSource:()=>de,DropTarget:()=>ye,createDndContext:()=>r.W,useDrag:()=>R,useDragLayer:()=>L.f,useDrop:()=>_});var r=n(94147),o=n(67294);var i=0,a=(0,o.memo)((function(e){var t,n,a,s=e.children,l=(a=function(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}(e,["children"]),t="manager"in a?[{dragDropManager:a.manager},!1]:[function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c(),n=arguments.length>2?arguments[2]:void 0,o=arguments.length>3?arguments[3]:void 0,i=t;return i[u]||(i[u]=(0,r.W)(e,t,n,o)),i[u]}(a.backend,a.context,a.options,a.debugMode),!a.context],n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),d=l[0],f=l[1];return o.useEffect((function(){return f&&i++,function(){f&&0==--i&&(c()[u]=null)}}),[]),o.createElement(r.L.Provider,{value:d},s)}));a.displayName="DndProvider";var u=Symbol.for("__REACT_DND_CONTEXT_INSTANCE__");function c(){return void 0!==n.g?n.g:window}var s=o.memo((function(e){var t=e.connect,n=e.src;if("undefined"!=typeof Image){var r=new Image;r.src=n,r.onload=function(){return t(r)}}return null}));s.displayName="DragPreviewImage";var l=n(28195),d=n(48586),f=n(24974);function p(e,t,n){var r,o,i=(r=(0,f.r)(e,t,n),o=2,function(e){if(Array.isArray(e))return e}(r)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(r,o)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),a=i[0],u=i[1];return(0,d.L)((function(){var t=e.getHandlerId();if(null!=t)return e.subscribeToStateChange(u,{handlerIds:[t]})}),[e,u]),a}function h(e,t,n){var r=n.getRegistry(),o=r.addTarget(e,t);return[o,function(){return r.removeTarget(o)}]}function g(e,t,n){var r=n.getRegistry(),o=r.addSource(e,t);return[o,function(){return r.removeSource(o)}]}var y=n(75795);function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var b=!1,m=!1,D=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.sourceId=null,this.internalMonitor=t.getMonitor()}var t,n;return t=e,(n=[{key:"receiveHandlerId",value:function(e){this.sourceId=e}},{key:"getHandlerId",value:function(){return this.sourceId}},{key:"canDrag",value:function(){(0,l.k)(!b,"You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");try{return b=!0,this.internalMonitor.canDragSource(this.sourceId)}finally{b=!1}}},{key:"isDragging",value:function(){if(!this.sourceId)return!1;(0,l.k)(!m,"You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");try{return m=!0,this.internalMonitor.isDraggingSource(this.sourceId)}finally{m=!1}}},{key:"subscribeToStateChange",value:function(e,t){return this.internalMonitor.subscribeToStateChange(e,t)}},{key:"isDraggingSource",value:function(e){return this.internalMonitor.isDraggingSource(e)}},{key:"isOverTarget",value:function(e,t){return this.internalMonitor.isOverTarget(e,t)}},{key:"getTargetIds",value:function(){return this.internalMonitor.getTargetIds()}},{key:"isSourcePublic",value:function(){return this.internalMonitor.isSourcePublic()}},{key:"getSourceId",value:function(){return this.internalMonitor.getSourceId()}},{key:"subscribeToOffsetChange",value:function(e){return this.internalMonitor.subscribeToOffsetChange(e)}},{key:"canDragSource",value:function(e){return this.internalMonitor.canDragSource(e)}},{key:"canDropOnTarget",value:function(e){return this.internalMonitor.canDropOnTarget(e)}},{key:"getItemType",value:function(){return this.internalMonitor.getItemType()}},{key:"getItem",value:function(){return this.internalMonitor.getItem()}},{key:"getDropResult",value:function(){return this.internalMonitor.getDropResult()}},{key:"didDrop",value:function(){return this.internalMonitor.didDrop()}},{key:"getInitialClientOffset",value:function(){return this.internalMonitor.getInitialClientOffset()}},{key:"getInitialSourceClientOffset",value:function(){return this.internalMonitor.getInitialSourceClientOffset()}},{key:"getSourceClientOffset",value:function(){return this.internalMonitor.getSourceClientOffset()}},{key:"getClientOffset",value:function(){return this.internalMonitor.getClientOffset()}},{key:"getDifferenceFromInitialOffset",value:function(){return this.internalMonitor.getDifferenceFromInitialOffset()}}])&&v(t.prototype,n),e}();function k(e,t){"function"==typeof e?e(t):e.current=t}function w(e,t){var n=e.ref;return(0,l.k)("string"!=typeof n,"Cannot connect React DnD to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute"),n?(0,o.cloneElement)(e,{ref:function(e){k(n,e),k(t,e)}}):(0,o.cloneElement)(e,{ref:t})}function S(e){if("string"!=typeof e.type){var t=e.type.displayName||e.type.name||"the component";throw new Error("Only native element nodes can now be passed to React DnD connectors."+"You can either wrap ".concat(t," into a <div>, or turn it into a ")+"drag source or a drop target itself.")}}function C(e){var t={};return Object.keys(e).forEach((function(n){var r=e[n];if(n.endsWith("Ref"))t[n]=e[n];else{var i=function(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(!(0,o.isValidElement)(t)){var r=t;return e(r,n),r}var i=t;return S(i),w(i,n?function(t){return e(t,n)}:e)}}(r);t[n]=function(){return i}}})),t}function O(e){return(O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function I(e){return null!==e&&"object"===O(e)&&e.hasOwnProperty("current")}var T=n(15047);function P(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var j=function(){function e(t){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.hooks=C({dragSource:function(e,t){n.clearDragSource(),n.dragSourceOptions=t||null,I(e)?n.dragSourceRef=e:n.dragSourceNode=e,n.reconnectDragSource()},dragPreview:function(e,t){n.clearDragPreview(),n.dragPreviewOptions=t||null,I(e)?n.dragPreviewRef=e:n.dragPreviewNode=e,n.reconnectDragPreview()}}),this.handlerId=null,this.dragSourceRef=null,this.dragSourceOptionsInternal=null,this.dragPreviewRef=null,this.dragPreviewOptionsInternal=null,this.lastConnectedHandlerId=null,this.lastConnectedDragSource=null,this.lastConnectedDragSourceOptions=null,this.lastConnectedDragPreview=null,this.lastConnectedDragPreviewOptions=null,this.backend=t}var t,n;return t=e,(n=[{key:"receiveHandlerId",value:function(e){this.handlerId!==e&&(this.handlerId=e,this.reconnect())}},{key:"reconnect",value:function(){this.reconnectDragSource(),this.reconnectDragPreview()}},{key:"reconnectDragSource",value:function(){var e=this.dragSource,t=this.didHandlerIdChange()||this.didConnectedDragSourceChange()||this.didDragSourceOptionsChange();t&&this.disconnectDragSource(),this.handlerId&&(e?t&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDragSource=e,this.lastConnectedDragSourceOptions=this.dragSourceOptions,this.dragSourceUnsubscribe=this.backend.connectDragSource(this.handlerId,e,this.dragSourceOptions)):this.lastConnectedDragSource=e)}},{key:"reconnectDragPreview",value:function(){var e=this.dragPreview,t=this.didHandlerIdChange()||this.didConnectedDragPreviewChange()||this.didDragPreviewOptionsChange();this.handlerId?this.dragPreview&&t&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDragPreview=e,this.lastConnectedDragPreviewOptions=this.dragPreviewOptions,this.disconnectDragPreview(),this.dragPreviewUnsubscribe=this.backend.connectDragPreview(this.handlerId,e,this.dragPreviewOptions)):this.disconnectDragPreview()}},{key:"didHandlerIdChange",value:function(){return this.lastConnectedHandlerId!==this.handlerId}},{key:"didConnectedDragSourceChange",value:function(){return this.lastConnectedDragSource!==this.dragSource}},{key:"didConnectedDragPreviewChange",value:function(){return this.lastConnectedDragPreview!==this.dragPreview}},{key:"didDragSourceOptionsChange",value:function(){return!(0,T.w)(this.lastConnectedDragSourceOptions,this.dragSourceOptions)}},{key:"didDragPreviewOptionsChange",value:function(){return!(0,T.w)(this.lastConnectedDragPreviewOptions,this.dragPreviewOptions)}},{key:"disconnectDragSource",value:function(){this.dragSourceUnsubscribe&&(this.dragSourceUnsubscribe(),this.dragSourceUnsubscribe=void 0)}},{key:"disconnectDragPreview",value:function(){this.dragPreviewUnsubscribe&&(this.dragPreviewUnsubscribe(),this.dragPreviewUnsubscribe=void 0,this.dragPreviewNode=null,this.dragPreviewRef=null)}},{key:"clearDragSource",value:function(){this.dragSourceNode=null,this.dragSourceRef=null}},{key:"clearDragPreview",value:function(){this.dragPreviewNode=null,this.dragPreviewRef=null}},{key:"connectTarget",get:function(){return this.dragSource}},{key:"dragSourceOptions",get:function(){return this.dragSourceOptionsInternal},set:function(e){this.dragSourceOptionsInternal=e}},{key:"dragPreviewOptions",get:function(){return this.dragPreviewOptionsInternal},set:function(e){this.dragPreviewOptionsInternal=e}},{key:"dragSource",get:function(){return this.dragSourceNode||this.dragSourceRef&&this.dragSourceRef.current}},{key:"dragPreview",get:function(){return this.dragPreviewNode||this.dragPreviewRef&&this.dragPreviewRef.current}}])&&P(t.prototype,n),e}();function M(e){return(M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(e){var t=(0,o.useRef)(e);t.current=e,(0,l.k)(null!=e.item,"item must be defined"),(0,l.k)(null!=e.item.type,"item type must be defined");var n,r,i,a=(n=(0,y.N)(),r=[(0,o.useMemo)((function(){return new D(n)}),[n]),(0,o.useMemo)((function(){return new j(n.getBackend())}),[n])],i=2,function(e){if(Array.isArray(e))return e}(r)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(r,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),u=a[0],c=a[1];!function(e,t,n){var r=(0,y.N)(),i=(0,o.useMemo)((function(){return{beginDrag:function(){var n=e.current,r=n.begin,o=n.item;if(r){var i=r(t);return(0,l.k)(null==i||"object"===M(i),"dragSpec.begin() must either return an object, undefined, or null"),i||o||{}}return o||{}},canDrag:function(){return"boolean"==typeof e.current.canDrag?e.current.canDrag:"function"!=typeof e.current.canDrag||e.current.canDrag(t)},isDragging:function(n,r){var o=e.current.isDragging;return o?o(t):r===n.getSourceId()},endDrag:function(){var r=e.current.end;r&&r(t.getItem(),t),n.reconnect()}}}),[]);(0,d.L)((function(){var o=function(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(g(e.current.item.type,i,r),2),a=o[0],u=o[1];return t.receiveHandlerId(a),n.receiveHandlerId(a),u}),[])}(t,u,c);var s=p(u,t.current.collect||function(){return{}},(function(){return c.reconnect()})),f=(0,o.useMemo)((function(){return c.hooks.dragSource()}),[c]),h=(0,o.useMemo)((function(){return c.hooks.dragPreview()}),[c]);return(0,d.L)((function(){c.dragSourceOptions=t.current.options||null,c.reconnect()}),[c]),(0,d.L)((function(){c.dragPreviewOptions=t.current.previewOptions||null,c.reconnect()}),[c]),[s,f,h]}function E(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var x=function(){function e(t){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.hooks=C({dropTarget:function(e,t){n.clearDropTarget(),n.dropTargetOptions=t,I(e)?n.dropTargetRef=e:n.dropTargetNode=e,n.reconnect()}}),this.handlerId=null,this.dropTargetRef=null,this.dropTargetOptionsInternal=null,this.lastConnectedHandlerId=null,this.lastConnectedDropTarget=null,this.lastConnectedDropTargetOptions=null,this.backend=t}var t,n;return t=e,(n=[{key:"reconnect",value:function(){var e=this.didHandlerIdChange()||this.didDropTargetChange()||this.didOptionsChange();e&&this.disconnectDropTarget();var t=this.dropTarget;this.handlerId&&(t?e&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDropTarget=t,this.lastConnectedDropTargetOptions=this.dropTargetOptions,this.unsubscribeDropTarget=this.backend.connectDropTarget(this.handlerId,t,this.dropTargetOptions)):this.lastConnectedDropTarget=t)}},{key:"receiveHandlerId",value:function(e){e!==this.handlerId&&(this.handlerId=e,this.reconnect())}},{key:"didHandlerIdChange",value:function(){return this.lastConnectedHandlerId!==this.handlerId}},{key:"didDropTargetChange",value:function(){return this.lastConnectedDropTarget!==this.dropTarget}},{key:"didOptionsChange",value:function(){return!(0,T.w)(this.lastConnectedDropTargetOptions,this.dropTargetOptions)}},{key:"disconnectDropTarget",value:function(){this.unsubscribeDropTarget&&(this.unsubscribeDropTarget(),this.unsubscribeDropTarget=void 0)}},{key:"clearDropTarget",value:function(){this.dropTargetRef=null,this.dropTargetNode=null}},{key:"connectTarget",get:function(){return this.dropTarget}},{key:"dropTargetOptions",get:function(){return this.dropTargetOptionsInternal},set:function(e){this.dropTargetOptionsInternal=e}},{key:"dropTarget",get:function(){return this.dropTargetNode||this.dropTargetRef&&this.dropTargetRef.current}}])&&E(t.prototype,n),e}();function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var H=!1,N=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.targetId=null,this.internalMonitor=t.getMonitor()}var t,n;return t=e,(n=[{key:"receiveHandlerId",value:function(e){this.targetId=e}},{key:"getHandlerId",value:function(){return this.targetId}},{key:"subscribeToStateChange",value:function(e,t){return this.internalMonitor.subscribeToStateChange(e,t)}},{key:"canDrop",value:function(){if(!this.targetId)return!1;(0,l.k)(!H,"You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor");try{return H=!0,this.internalMonitor.canDropOnTarget(this.targetId)}finally{H=!1}}},{key:"isOver",value:function(e){return!!this.targetId&&this.internalMonitor.isOverTarget(this.targetId,e)}},{key:"getItemType",value:function(){return this.internalMonitor.getItemType()}},{key:"getItem",value:function(){return this.internalMonitor.getItem()}},{key:"getDropResult",value:function(){return this.internalMonitor.getDropResult()}},{key:"didDrop",value:function(){return this.internalMonitor.didDrop()}},{key:"getInitialClientOffset",value:function(){return this.internalMonitor.getInitialClientOffset()}},{key:"getInitialSourceClientOffset",value:function(){return this.internalMonitor.getInitialSourceClientOffset()}},{key:"getSourceClientOffset",value:function(){return this.internalMonitor.getSourceClientOffset()}},{key:"getClientOffset",value:function(){return this.internalMonitor.getClientOffset()}},{key:"getDifferenceFromInitialOffset",value:function(){return this.internalMonitor.getDifferenceFromInitialOffset()}}])&&A(t.prototype,n),e}();function _(e){var t=(0,o.useRef)(e);t.current=e,(0,l.k)(null!=e.accept,"accept must be defined");var n,r,i,a=(n=(0,y.N)(),r=[(0,o.useMemo)((function(){return new N(n)}),[n]),(0,o.useMemo)((function(){return new x(n.getBackend())}),[n])],i=2,function(e){if(Array.isArray(e))return e}(r)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(r,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),u=a[0],c=a[1];!function(e,t,n){var r=(0,y.N)(),i=(0,o.useMemo)((function(){return{canDrop:function(){var n=e.current.canDrop;return!n||n(t.getItem(),t)},hover:function(){var n=e.current.hover;n&&n(t.getItem(),t)},drop:function(){var n=e.current.drop;if(n)return n(t.getItem(),t)}}}),[t]);(0,d.L)((function(){var o=function(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(h(e.current.accept,i,r),2),a=o[0],u=o[1];return t.receiveHandlerId(a),n.receiveHandlerId(a),u}),[t,n])}(t,u,c);var s=p(u,t.current.collect||function(){return{}},(function(){return c.reconnect()})),f=(0,o.useMemo)((function(){return c.hooks.dropTarget()}),[c]);return(0,d.L)((function(){c.dropTargetOptions=e.options||null,c.reconnect()}),[e.options]),[s,f]}var L=n(79336);function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function U(e){return"function"==typeof e}function W(){}function q(e){if(!function(e){return"object"===F(e)&&null!==e}(e))return!1;if(null===Object.getPrototypeOf(e))return!0;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function Y(e){var t=e.current;return null==t?null:t.decoratedRef?t.decoratedRef.current:t}function $(e){return(t=e)&&t.prototype&&"function"==typeof t.prototype.render||function(e){return e&&e.$$typeof&&"Symbol(react.forward_ref)"===e.$$typeof.toString()}(e);var t}var B=n(8679),V=n.n(B);function X(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function z(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function G(e,t,n){return t&&z(e.prototype,t),n&&z(e,n),e}var J=function(){function e(t){X(this,e),this.isDisposed=!1,this.action=U(t)?t:W}return G(e,[{key:"dispose",value:function(){this.isDisposed||(this.action(),this.isDisposed=!0)}}],[{key:"isDisposable",value:function(e){return e&&U(e.dispose)}},{key:"_fixup",value:function(t){return e.isDisposable(t)?t:e.empty}},{key:"create",value:function(t){return new e(t)}}]),e}();J.empty={dispose:W};var K=function(){function e(){X(this,e),this.isDisposed=!1;for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];this.disposables=n}return G(e,[{key:"add",value:function(e){this.isDisposed?e.dispose():this.disposables.push(e)}},{key:"remove",value:function(e){var t=!1;if(!this.isDisposed){var n=this.disposables.indexOf(e);-1!==n&&(t=!0,this.disposables.splice(n,1),e.dispose())}return t}},{key:"clear",value:function(){if(!this.isDisposed){for(var e=this.disposables.length,t=new Array(e),n=0;n<e;n++)t[n]=this.disposables[n];this.disposables=[];for(var r=0;r<e;r++)t[r].dispose()}}},{key:"dispose",value:function(){if(!this.isDisposed){this.isDisposed=!0;for(var e=this.disposables.length,t=new Array(e),n=0;n<e;n++)t[n]=this.disposables[n];this.disposables=[];for(var r=0;r<e;r++)t[r].dispose()}}}]),e}(),Q=function(){function e(){X(this,e),this.isDisposed=!1}return G(e,[{key:"getDisposable",value:function(){return this.current}},{key:"setDisposable",value:function(e){var t=this.isDisposed;if(!t){var n=this.current;this.current=e,n&&n.dispose()}t&&e&&e.dispose()}},{key:"dispose",value:function(){if(!this.isDisposed){this.isDisposed=!0;var e=this.current;this.current=void 0,e&&e.dispose()}}}]),e}();function Z(e){return(Z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ee(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function te(e){return(te=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ne(e,t){return(ne=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function re(e){var t=e.DecoratedComponent,n=e.createHandler,i=e.createMonitor,a=e.createConnector,u=e.registerHandler,c=e.containerDisplayName,s=e.getType,d=e.collect,f=e.options.arePropsEqual,p=void 0===f?T.w:f,h=t,g=t.displayName||t.name||"Component",y=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Z(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}(this,te(t).call(this,e))).decoratedRef=o.createRef(),n.handleChange=function(){var e=n.getCurrentState();(0,T.w)(e,n.state)||n.setState(e)},n.disposable=new Q,n.receiveProps(e),n.dispose(),n}var c,f;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ne(e,t)}(t,e),c=t,(f=[{key:"getHandlerId",value:function(){return this.handlerId}},{key:"getDecoratedComponentInstance",value:function(){return(0,l.k)(this.decoratedRef.current,"In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()"),this.decoratedRef.current}},{key:"shouldComponentUpdate",value:function(e,t){return!p(e,this.props)||!(0,T.w)(t,this.state)}},{key:"componentDidMount",value:function(){this.disposable=new Q,this.currentType=void 0,this.receiveProps(this.props),this.handleChange()}},{key:"componentDidUpdate",value:function(e){p(this.props,e)||(this.receiveProps(this.props),this.handleChange())}},{key:"componentWillUnmount",value:function(){this.dispose()}},{key:"receiveProps",value:function(e){this.handler&&(this.handler.receiveProps(e),this.receiveType(s(e)))}},{key:"receiveType",value:function(e){if(this.handlerMonitor&&this.manager&&this.handlerConnector&&e!==this.currentType){this.currentType=e;var t=(i=u(e,this.handler,this.manager),a=2,function(e){if(Array.isArray(e))return e}(i)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(i,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),n=t[0],r=t[1];this.handlerId=n,this.handlerMonitor.receiveHandlerId(n),this.handlerConnector.receiveHandlerId(n);var o=this.manager.getMonitor().subscribeToStateChange(this.handleChange,{handlerIds:[n]});this.disposable.setDisposable(new K(new J(o),new J(r)))}var i,a}},{key:"dispose",value:function(){this.disposable.dispose(),this.handlerConnector&&this.handlerConnector.receiveHandlerId(null)}},{key:"getCurrentState",value:function(){return this.handlerConnector?d(this.handlerConnector.hooks,this.handlerMonitor,this.props):{}}},{key:"render",value:function(){var e=this;return o.createElement(r.L.Consumer,null,(function(t){var n=t.dragDropManager;return e.receiveDragDropManager(n),"undefined"!=typeof requestAnimationFrame&&requestAnimationFrame((function(){return e.handlerConnector.reconnect()})),o.createElement(h,Object.assign({},e.props,e.getCurrentState(),{ref:$(h)?e.decoratedRef:null}))}))}},{key:"receiveDragDropManager",value:function(e){void 0===this.manager&&((0,l.k)(void 0!==e,"Could not find the drag and drop manager in the context of %s. Make sure to render a DndProvider component in your top-level component. Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context",g,g),void 0!==e&&(this.manager=e,this.handlerMonitor=i(e),this.handlerConnector=a(e.getBackend()),this.handler=n(this.handlerMonitor,this.decoratedRef)))}}])&&ee(c.prototype,f),t}(o.Component);return y.DecoratedComponent=t,y.displayName="".concat(c,"(").concat(g,")"),V()(y,t)}function oe(e){return(oe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ie(e,t){return"string"==typeof e||"symbol"===oe(e)||!!t&&Array.isArray(e)&&e.every((function(e){return ie(e,!1)}))}function ae(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var ue=["canDrag","beginDrag","isDragging","endDrag"],ce=["beginDrag"],se=function(){function e(t,n,r){var o=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.props=null,this.beginDrag=function(){if(o.props)return o.spec.beginDrag(o.props,o.monitor,o.ref.current)},this.spec=t,this.monitor=n,this.ref=r}var t,n;return t=e,(n=[{key:"receiveProps",value:function(e){this.props=e}},{key:"canDrag",value:function(){return!!this.props&&(!this.spec.canDrag||this.spec.canDrag(this.props,this.monitor))}},{key:"isDragging",value:function(e,t){return!!this.props&&(this.spec.isDragging?this.spec.isDragging(this.props,this.monitor):t===e.getSourceId())}},{key:"endDrag",value:function(){this.props&&this.spec.endDrag&&this.spec.endDrag(this.props,this.monitor,Y(this.ref))}}])&&ae(t.prototype,n),e}();function le(e){return Object.keys(e).forEach((function(t){(0,l.k)(ue.indexOf(t)>-1,'Expected the drag source specification to only have some of the following keys: %s. Instead received a specification with an unexpected "%s" key. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',ue.join(", "),t),(0,l.k)("function"==typeof e[t],"Expected %s in the drag source specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source",t,t,e[t])})),ce.forEach((function(t){(0,l.k)("function"==typeof e[t],"Expected %s in the drag source specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source",t,t,e[t])})),function(t,n){return new se(e,t,n)}}function de(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=e;"function"!=typeof e&&((0,l.k)(ie(e),'Expected "type" provided as the first argument to DragSource to be a string, or a function that returns a string given the current props. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',e),o=function(){return e}),(0,l.k)(q(t),'Expected "spec" provided as the second argument to DragSource to be a plain object. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',t);var i=le(t);return(0,l.k)("function"==typeof n,'Expected "collect" provided as the third argument to DragSource to be a function that returns a plain object of props to inject. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',n),(0,l.k)(q(r),'Expected "options" provided as the fourth argument to DragSource to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',n),function(e){return re({containerDisplayName:"DragSource",createHandler:i,registerHandler:g,createConnector:function(e){return new j(e)},createMonitor:function(e){return new D(e)},DecoratedComponent:e,getType:o,collect:n,options:r})}}function fe(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var pe=["canDrop","hover","drop"],he=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.props=null,this.spec=t,this.monitor=n,this.ref=r}var t,n;return t=e,(n=[{key:"receiveProps",value:function(e){this.props=e}},{key:"receiveMonitor",value:function(e){this.monitor=e}},{key:"canDrop",value:function(){return!this.spec.canDrop||this.spec.canDrop(this.props,this.monitor)}},{key:"hover",value:function(){this.spec.hover&&this.spec.hover(this.props,this.monitor,Y(this.ref))}},{key:"drop",value:function(){if(this.spec.drop)return this.spec.drop(this.props,this.monitor,this.ref.current)}}])&&fe(t.prototype,n),e}();function ge(e){return Object.keys(e).forEach((function(t){(0,l.k)(pe.indexOf(t)>-1,'Expected the drop target specification to only have some of the following keys: %s. Instead received a specification with an unexpected "%s" key. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',pe.join(", "),t),(0,l.k)("function"==typeof e[t],"Expected %s in the drop target specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target",t,t,e[t])})),function(t,n){return new he(e,t,n)}}function ye(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=e;"function"!=typeof e&&((0,l.k)(ie(e,!0),'Expected "type" provided as the first argument to DropTarget to be a string, an array of strings, or a function that returns either given the current props. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',e),o=function(){return e}),(0,l.k)(q(t),'Expected "spec" provided as the second argument to DropTarget to be a plain object. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',t);var i=ge(t);return(0,l.k)("function"==typeof n,'Expected "collect" provided as the third argument to DropTarget to be a function that returns a plain object of props to inject. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',n),(0,l.k)(q(r),'Expected "options" provided as the fourth argument to DropTarget to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',n),function(e){return re({containerDisplayName:"DropTarget",createHandler:i,registerHandler:h,createMonitor:function(e){return new N(e)},createConnector:function(e){return new x(e)},DecoratedComponent:e,getType:o,collect:n,options:r})}}function ve(e){return(ve="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function be(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function me(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function De(e,t,n){return t&&me(e.prototype,t),n&&me(e,n),e}function ke(e,t){return!t||"object"!==ve(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function we(e){return(we=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Se(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Ce(e,t)}function Ce(e,t){return(Ce=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Oe(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,l.k)("function"==typeof e,'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ',"Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer",e),(0,l.k)(q(t),'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer',t),function(n){var i=n,a=t.arePropsEqual,u=void 0===a?T.w:a,c=i.displayName||i.name||"Component",s=function(t){function n(){var e;return be(this,n),(e=ke(this,we(n).apply(this,arguments))).isCurrentlyMounted=!1,e.ref=o.createRef(),e.handleChange=function(){if(e.isCurrentlyMounted){var t=e.getCurrentState();(0,T.w)(t,e.state)||e.setState(t)}},e}return Se(n,t),De(n,[{key:"getDecoratedComponentInstance",value:function(){return(0,l.k)(this.ref.current,"In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()"),this.ref.current}},{key:"shouldComponentUpdate",value:function(e,t){return!u(e,this.props)||!(0,T.w)(t,this.state)}},{key:"componentDidMount",value:function(){this.isCurrentlyMounted=!0,this.handleChange()}},{key:"componentWillUnmount",value:function(){this.isCurrentlyMounted=!1,this.unsubscribeFromOffsetChange&&(this.unsubscribeFromOffsetChange(),this.unsubscribeFromOffsetChange=void 0),this.unsubscribeFromStateChange&&(this.unsubscribeFromStateChange(),this.unsubscribeFromStateChange=void 0)}},{key:"render",value:function(){var e=this;return o.createElement(r.L.Consumer,null,(function(t){var n=t.dragDropManager;return void 0===n?null:(e.receiveDragDropManager(n),e.isCurrentlyMounted?o.createElement(i,Object.assign({},e.props,e.state,{ref:$(i)?e.ref:null})):null)}))}},{key:"receiveDragDropManager",value:function(e){if(void 0===this.manager){this.manager=e,(0,l.k)("object"===ve(e),"Could not find the drag and drop manager in the context of %s. Make sure to render a DndProvider component in your top-level component. Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context",c,c);var t=this.manager.getMonitor();this.unsubscribeFromOffsetChange=t.subscribeToOffsetChange(this.handleChange),this.unsubscribeFromStateChange=t.subscribeToStateChange(this.handleChange)}}},{key:"getCurrentState",value:function(){if(!this.manager)return{};var t=this.manager.getMonitor();return e(t,this.props)}}]),n}(o.Component);return s.displayName="DragLayer(".concat(c,")"),s.DecoratedComponent=n,V()(s,n)}}}}]);
//# sourceMappingURL=npm.react-dnd.24d56c1023a92741f176.bundle.js.map