(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{422:function(e,t,n){"use strict";n.r(t);n(5),n(8),n(11),n(12);var r=n(21),o=n(2),c=(n(62),n(58),n(7),n(10),n(49),n(26),n(107));function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var d={data:function(){return{focus:"",type:"month",typeToLabel:{month:"Month",week:"Week",day:"Day","4day":"4 Days"},types:["month","week","day","4day"],selectedEvent:{},selectedElement:null,selectedOpen:!1,mode:"stack",modes:["stack","column"],weekday:[0,1,2,3,4,5,6],weekdays:[{text:"Sun - Sat",value:[0,1,2,3,4,5,6]},{text:"Mon - Sun",value:[1,2,3,4,5,6,0]},{text:"Mon - Fri",value:[1,2,3,4,5]},{text:"Mon, Wed, Fri",value:[1,3,5]}],value:"",events:[],colors:["blue","indigo","deep-purple","cyan","green","orange","grey darken-1"]}},mounted:function(){this.$refs.calendar.checkChange()},methods:v(v({viewDay:function(e){var t=e.date;this.focus=t,this.type="day"},setToday:function(){this.focus=""},prev:function(){this.$refs.calendar.prev()},next:function(){this.$refs.calendar.next()},showEvent:function(e){var t=this,n=e.nativeEvent,r=e.event,o=function(){t.selectedEvent=r,t.selectedElement=n.target,setTimeout((function(){t.selectedOpen=!0}),10)};this.selectedOpen?(this.selectedOpen=!1,setTimeout(o,10)):o(),n.stopPropagation()},updateRange:function(e){var t=this;return Object(r.a)(regeneratorRuntime.mark((function n(){var r,o,c,l,v,i;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=e.start,o=e.end,c=[],t.setStartEnd({start:r,end:o}),n.next=5,t.fetchTimes(r,o);case 5:if((l=t.$store.getters["prayertimes/getTimes"](r,o)).length){n.next=8;break}return n.abrupt("return");case 8:for(v=function(i){var e=l[i].date.readable;Object.keys(l[i].timings).forEach((function(n){if(!["Midnight","Imsak","Sunrise","Sunset"].includes(n)){var r="".concat(e," ").concat(l[i].timings[n]),o=Date.parse(r);c.push({name:n,start:o,end:o+9e5,color:t.colors[t.rnd(0,t.colors.length-1)],timed:!0})}}))},i=0;i<l.length;i++)v(i);t.events=c;case 11:case"end":return n.stop()}}),n)})))()},getEventColor:function(e){return e.color},rnd:function(a,b){return Math.floor((b-a+1)*Math.random())+a}},Object(c.b)({fetchTimes:"prayertimes/fetchTimes"})),Object(c.c)({setStartEnd:"calendar/setStartEnd"}))},f=n(84),m=n(115),h=n.n(m),y=n(179),_=n(420),k=n(375),O=n(372),w=n(418),x=n(161),E=n(162),T=n(106),j=n(76),V=n(421),S=n(419),C=n(46),D=n(367),M=n(47),P=n(178),component=Object(f.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-row",{staticClass:"fill-height"},[n("v-col",[n("v-sheet",{attrs:{height:"64"}},[n("v-toolbar",{attrs:{flat:""}},[n("v-btn",{staticClass:"mr-4",attrs:{outlined:"",color:"grey darken-2"},on:{click:e.setToday}},[e._v("\n          Today\n        ")]),e._v(" "),n("v-btn",{attrs:{fab:"",text:"",small:"",color:"grey darken-2"},on:{click:e.prev}},[n("v-icon",{attrs:{small:""}},[e._v(" mdi-chevron-left ")])],1),e._v(" "),n("v-btn",{attrs:{fab:"",text:"",small:"",color:"grey darken-2"},on:{click:e.next}},[n("v-icon",{attrs:{small:""}},[e._v(" mdi-chevron-right ")])],1),e._v(" "),e.$refs.calendar?n("v-toolbar-title",[e._v("\n          "+e._s(e.$refs.calendar.title)+"\n        ")]):e._e(),e._v(" "),n("v-spacer"),e._v(" "),n("v-menu",{attrs:{bottom:"",right:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,o=t.attrs;return[n("v-btn",e._g(e._b({attrs:{outlined:"",color:"grey darken-2"}},"v-btn",o,!1),r),[n("span",[e._v(e._s(e.typeToLabel[e.type]))]),e._v(" "),n("v-icon",{attrs:{right:""}},[e._v(" mdi-menu-down ")])],1)]}}])},[e._v(" "),n("v-list",[n("v-list-item",{on:{click:function(t){e.type="day"}}},[n("v-list-item-title",[e._v("Day")])],1),e._v(" "),n("v-list-item",{on:{click:function(t){e.type="week"}}},[n("v-list-item-title",[e._v("Week")])],1),e._v(" "),n("v-list-item",{on:{click:function(t){e.type="month"}}},[n("v-list-item-title",[e._v("Month")])],1),e._v(" "),n("v-list-item",{on:{click:function(t){e.type="4day"}}},[n("v-list-item-title",[e._v("4 days")])],1)],1)],1)],1)],1),e._v(" "),n("v-sheet",{attrs:{height:"600"}},[n("v-calendar",{ref:"calendar",attrs:{color:"primary",events:e.events,"event-color":e.getEventColor,type:e.type},on:{"click:event":e.showEvent,"click:more":e.viewDay,"click:date":e.viewDay,change:e.updateRange},model:{value:e.focus,callback:function(t){e.focus=t},expression:"focus"}}),e._v(" "),n("v-menu",{attrs:{"close-on-content-click":!1,activator:e.selectedElement,"offset-x":""},model:{value:e.selectedOpen,callback:function(t){e.selectedOpen=t},expression:"selectedOpen"}},[n("v-card",{attrs:{color:"grey lighten-4","min-width":"350px",flat:""}},[n("v-toolbar",{attrs:{color:e.selectedEvent.color,dark:""}},[n("v-btn",{attrs:{icon:""}},[n("v-icon",[e._v("mdi-pencil")])],1),e._v(" "),n("v-toolbar-title",{domProps:{innerHTML:e._s(e.selectedEvent.name)}}),e._v(" "),n("v-spacer"),e._v(" "),n("v-btn",{attrs:{icon:""}},[n("v-icon",[e._v("mdi-heart")])],1),e._v(" "),n("v-btn",{attrs:{icon:""}},[n("v-icon",[e._v("mdi-dots-vertical")])],1)],1),e._v(" "),n("v-card-text",[n("span",{domProps:{innerHTML:e._s(e.selectedEvent.details)}})]),e._v(" "),n("v-card-actions",[n("v-btn",{attrs:{text:"",color:"secondary"},on:{click:function(t){e.selectedOpen=!1}}},[e._v("\n              Cancel\n            ")])],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;h()(component,{VBtn:y.a,VCalendar:_.a,VCard:k.a,VCardActions:O.a,VCardText:O.b,VCol:w.a,VIcon:x.a,VList:E.a,VListItem:T.a,VListItemTitle:j.b,VMenu:V.a,VRow:S.a,VSheet:C.a,VSpacer:D.a,VToolbar:M.a,VToolbarTitle:P.a})}}]);