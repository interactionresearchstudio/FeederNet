(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{135:function(e,t,a){},137:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(27),i=a.n(r),c=(a(71),a(9)),d=a(10),o=a(12),u=a(11),s=a(13),h=a(145),m=a(146),b=a(3),f=a(148),p=a(149),g=a(144),E=a(16),v=a.n(E),y=a(138),O=a(139),j=a(140),k=a(141),S=a(142),C=a(147),F=function(e){function t(e,a){var n;return Object(c.a)(this,t),(n=Object(o.a)(this,Object(u.a)(t).call(this,e,a))).handleRfidChange=n.handleRfidChange.bind(Object(b.a)(Object(b.a)(n))),n.handleNameChange=n.handleNameChange.bind(Object(b.a)(Object(b.a)(n))),n.handleSubmit=n.handleSubmit.bind(Object(b.a)(Object(b.a)(n))),n.handleUpdate=n.handleUpdate.bind(Object(b.a)(Object(b.a)(n))),n.state={birdName:"",birdRfid:"",birdId:"",updating:!1},n}return Object(s.a)(t,e),Object(d.a)(t,[{key:"handleRfidChange",value:function(e){this.setState({birdRfid:e.target.value})}},{key:"handleNameChange",value:function(e){this.setState({birdName:e.target.value})}},{key:"placeData",value:function(e){this.setState({birdName:e.name,birdRfid:e.rfid,birdId:e._id,updating:!0})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.addBird(this.state.birdName,this.state.birdRfid,function(e){e?console.log(e):t.setState({birdName:"",birdRfid:"",birdId:"",updating:!1})})}},{key:"handleUpdate",value:function(e){var t=this;e.preventDefault(),this.props.updateBird(this.state.birdId,{name:this.state.birdName,rfid:this.state.birdRfid},function(e){e?console.log(e):t.setState({birdName:"",birdRfid:"",birdId:"",updating:!1})})}},{key:"renderButton",value:function(){return this.state.updating?l.a.createElement(y.a,{type:"submit",onClick:this.handleUpdate},"Update Bird"):l.a.createElement(y.a,{type:"submit",onClick:this.handleSubmit},"Add New Bird")}},{key:"render",value:function(){return l.a.createElement("form",null,l.a.createElement(O.a,null,l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"birdName"},l.a.createElement(S.a,null,"Bird name"),l.a.createElement(C.a,{type:"text",value:this.state.birdName,placeholder:"Apollo",onChange:this.handleNameChange}))),l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"birdRfid"},l.a.createElement(S.a,null,"RFID tag"),l.a.createElement(C.a,{type:"text",value:this.state.birdRfid,placeholder:"123456789",onChange:this.handleRfidChange})))),l.a.createElement("div",{className:"form-row"},this.renderButton()))}}]),t}(n.Component),w=a(126),B=a(143),D=function(e){function t(){return Object(c.a)(this,t),Object(o.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(d.a)(t,[{key:"buildRows",value:function(){var e=this;if(null!=this.props.birds)return this.props.birds.map(function(t,a){return l.a.createElement("tr",{key:a},l.a.createElement("td",null,t.name),l.a.createElement("td",null,t.rfid),l.a.createElement("td",null,l.a.createElement(y.a,{onClick:function(){return e.props.deleteBird(t._id)},bsSize:"xsmall"},l.a.createElement(w.a,{glyph:"remove"})),l.a.createElement(y.a,{onClick:function(){return e.props.updateBird(t._id)},bsSize:"xsmall"},l.a.createElement(w.a,{glyph:"pencil"}))))})}},{key:"render",value:function(){return l.a.createElement(B.a,{striped:!0,bordered:!0,condensed:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Bird Name"),l.a.createElement("th",null,"RFID Tag"),l.a.createElement("th",null,"Actions"))),l.a.createElement("tbody",null,this.buildRows()))}}]),t}(n.Component),N=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).state={birds:[]},a.birdFormElement=l.a.createRef(),a.addBird=a.addBird.bind(Object(b.a)(Object(b.a)(a))),a.deleteBird=a.deleteBird.bind(Object(b.a)(Object(b.a)(a))),a.editBird=a.editBird.bind(Object(b.a)(Object(b.a)(a))),a.updateBird=a.updateBird.bind(Object(b.a)(Object(b.a)(a))),a}return Object(s.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getBirds()}},{key:"getBirds",value:function(){var e=this;v.a.get("/api/birds").then(function(t){e.setState({birds:t.data})}).catch(function(t){console.log(t),e.setState({birds:null})})}},{key:"addBird",value:function(e,t,a){var n=this,l={name:e,rfid:t};v.a.post("/api/birds",l).then(function(e){console.log(e.data),n.getBirds(),a(null)}).catch(function(e){console.log(e),a(e)})}},{key:"deleteBird",value:function(e){var t=this;console.log("Delete item with ID "+e),v.a.delete("/api/bird/"+e).then(function(e){t.getBirds()}).catch(function(e){console.log(e)})}},{key:"editBird",value:function(e){var t=this;v.a.get("/api/bird/"+e).then(function(e){t.birdFormElement.current.placeData(e.data)}).catch(function(e){console.log(e)})}},{key:"updateBird",value:function(e,t,a){var n=this;console.log("Update item with ID "+e),v.a.put("/api/bird/"+e,t).then(function(e){n.getBirds(),a(null)}).catch(function(e){console.log(e)})}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(F,{ref:this.birdFormElement,addBird:this.addBird,updateBird:this.updateBird}),l.a.createElement("br",null),l.a.createElement(D,{birds:this.state.birds,deleteBird:this.deleteBird,updateBird:this.editBird}))}}]),t}(n.Component),I=function(e){function t(e,a){var n;return Object(c.a)(this,t),(n=Object(o.a)(this,Object(u.a)(t).call(this,e,a))).handleNameChange=n.handleNameChange.bind(Object(b.a)(Object(b.a)(n))),n.handleStubChange=n.handleStubChange.bind(Object(b.a)(Object(b.a)(n))),n.handleLatitudeChange=n.handleLatitudeChange.bind(Object(b.a)(Object(b.a)(n))),n.handleLongitudeChange=n.handleLongitudeChange.bind(Object(b.a)(Object(b.a)(n))),n.handleSubmit=n.handleSubmit.bind(Object(b.a)(Object(b.a)(n))),n.state={feederName:"",feederStub:"",feederLatitude:"",feederLongitude:""},n}return Object(s.a)(t,e),Object(d.a)(t,[{key:"handleNameChange",value:function(e){this.setState({feederName:e.target.value,feederStub:e.target.value.replace(/\s/g,"")})}},{key:"handleStubChange",value:function(e){this.setState({feederStub:e.target.value})}},{key:"handleLatitudeChange",value:function(e){this.setState({feederLatitude:e.target.value})}},{key:"handleLongitudeChange",value:function(e){this.setState({feederLongitude:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.addFeeder(this.state.feederStub,this.state.feederName,this.state.feederLatitude,this.state.feederLongitude,function(e){e?console.log("ERROR: Could not add feeder."):t.setState({feederName:"",feederStub:"",feederLatitude:"",feederLongitude:""})})}},{key:"render",value:function(){return l.a.createElement("form",null,l.a.createElement(O.a,null,l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"feederName"},l.a.createElement(S.a,null,"Feeder name"),l.a.createElement(C.a,{type:"text",value:this.state.feederName,placeholder:"Feeder 1",onChange:this.handleNameChange}))),l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"feederStub"},l.a.createElement(S.a,null,"Feeder stub"),l.a.createElement(C.a,{type:"text",value:this.state.feederStub,placeholder:"123456789",onChange:this.handleStubChange})))),l.a.createElement(O.a,null,l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"latitude"},l.a.createElement(S.a,null,"Latitude"),l.a.createElement(C.a,{type:"text",value:this.state.feederLatitude,placeholder:"50.0000",onChange:this.handleLatitudeChange}))),l.a.createElement(j.a,{sm:6},l.a.createElement(k.a,{controlId:"longitude"},l.a.createElement(S.a,null,"Longitude"),l.a.createElement(C.a,{type:"text",value:this.state.feederLongitude,placeholder:"-1.0000",onChange:this.handleLongitudeChange})))),l.a.createElement("div",{className:"form-row"},l.a.createElement(y.a,{type:"submit",onClick:this.handleSubmit},"Add New Feeder")))}}]),t}(n.Component),R=function(e){function t(){return Object(c.a)(this,t),Object(o.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(d.a)(t,[{key:"buildRows",value:function(){var e=this;return this.props.feeders.map(function(t,a){return l.a.createElement("tr",{key:a},l.a.createElement("td",null,t.name),l.a.createElement("td",null,t.stub),l.a.createElement("td",null,t.location.latitude),l.a.createElement("td",null,t.location.longitude),l.a.createElement("td",null,e.convertTime(t.lastPing)),l.a.createElement("td",null,l.a.createElement(y.a,{onClick:function(){return e.props.deleteFeeder(t._id)},bsSize:"xsmall"},l.a.createElement(w.a,{glyph:"remove"}))))})}},{key:"isFeederWithinFilter",value:function(e,t){if("0"===e.latitude&&"0"===e.longitude)return!0}},{key:"convertTime",value:function(e){var t=new Date(1e3*e),a=t.getFullYear(),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()];return t.getDate()+" "+n+" "+a+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()}},{key:"render",value:function(){return l.a.createElement(B.a,{striped:!0,bordered:!0,condensed:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Feeder Name"),l.a.createElement("th",null,"Feeder Stub"),l.a.createElement("th",null,"Latitude"),l.a.createElement("th",null,"Longitude"),l.a.createElement("th",null,"Last Ping"),l.a.createElement("th",null,"Actions"))),l.a.createElement("tbody",null,this.buildRows()))}}]),t}(n.Component),L=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).state={feeders:[]},a.addFeeder=a.addFeeder.bind(Object(b.a)(Object(b.a)(a))),a.deleteFeeder=a.deleteFeeder.bind(Object(b.a)(Object(b.a)(a))),a}return Object(s.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getFeeders()}},{key:"getFeeders",value:function(){var e=this;v.a.get("/api/feeders").then(function(t){e.setState({feeders:t.data})}).catch(function(e){console.log(e)})}},{key:"deleteFeeder",value:function(e){var t=this;console.log("Delete item with ID "+e),v.a.delete("/api/feeder/"+e).then(function(e){t.getFeeders()}).catch(function(e){console.log(e)})}},{key:"addFeeder",value:function(e,t,a,n,l){var r=this,i={stub:e,name:t,location:{latitude:a,longitude:n},lastPing:"never"};v.a.post("/api/feeders",i).then(function(e){console.log(e.data),r.getFeeders(),l(null)}).catch(function(e){console.log(e),l(e)})}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(I,{addFeeder:this.addFeeder}),l.a.createElement("br",null),l.a.createElement(R,{feeders:this.state.feeders,deleteFeeder:this.deleteFeeder,locationFilter:this.props.locationFilter}))}}]),t}(n.Component),A=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).deleteItem=a.deleteItem.bind(Object(b.a)(Object(b.a)(a))),a.getEvents=a.getEvents.bind(Object(b.a)(Object(b.a)(a))),a.state={events:[]},a}return Object(s.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getEvents()}},{key:"getEvents",value:function(){var e=this;v.a.get("/api/events").then(function(t){t.data.sort(function(e,t){return parseFloat(t.datetime)-parseFloat(e.datetime)}),e.setState({events:t.data})}).catch(function(e){console.log(e)})}},{key:"buildRows",value:function(){var e=this;return this.state.events.map(function(t,a){return l.a.createElement("tr",{key:a},l.a.createElement("td",null,t.type),l.a.createElement("td",null,t.ip),l.a.createElement("td",null,e.convertTime(t.datetime)),l.a.createElement("td",null,l.a.createElement(y.a,{onClick:function(){return e.deleteItem(t._id)},bsSize:"xsmall"},l.a.createElement(w.a,{glyph:"remove"}))))})}},{key:"deleteItem",value:function(e){var t=this;console.log("Delete item with ID "+e),v.a.delete("/api/event/"+e).then(function(e){t.getEvents()}).catch(function(e){console.log(e)})}},{key:"convertTime",value:function(e){var t=new Date(1e3*e),a=t.getFullYear(),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()];return t.getDate()+" "+n+" "+a+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(y.a,{onClick:function(){return e.getEvents()},bsSize:"small"},l.a.createElement(w.a,{glyph:"refresh"})),l.a.createElement("br",null),l.a.createElement(B.a,{striped:!0,bordered:!0,condensed:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Event Type"),l.a.createElement("th",null,"IP Address"),l.a.createElement("th",null,"Date and Time"),l.a.createElement("th",null,"Actions"))),l.a.createElement("tbody",null,this.buildRows())))}}]),t}(n.Component),M=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).deleteItem=a.deleteItem.bind(Object(b.a)(Object(b.a)(a))),a.getWaypoints=a.getWaypoints.bind(Object(b.a)(Object(b.a)(a))),a.state={waypoints:[]},a}return Object(s.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getWaypoints()}},{key:"getWaypoints",value:function(){var e=this;v.a.get("/api/waypoints").then(function(t){t.data.sort(function(e,t){return parseFloat(t.datetime)-parseFloat(e.datetime)}),e.setState({waypoints:t.data})}).catch(function(e){console.log(e)})}},{key:"buildRows",value:function(){var e=this;return this.state.waypoints.map(function(t,a){return null==t.bird&&(t.bird={name:"Deleted",rfid:"Deleted"}),null==t.feeder&&(t.feeder={name:"Deleted",stub:"Deleted"}),l.a.createElement("tr",{key:a},l.a.createElement("td",null,t.bird.name),l.a.createElement("td",null,t.bird.rfid),l.a.createElement("td",null,t.feeder.name),l.a.createElement("td",null,e.convertTime(t.datetime)),l.a.createElement("td",null,l.a.createElement(y.a,{onClick:function(){return e.deleteItem(t._id)},bsSize:"xsmall"},l.a.createElement(w.a,{glyph:"remove"}))))})}},{key:"deleteItem",value:function(e){var t=this;console.log("Delete item with ID "+e),v.a.delete("/api/waypoint/"+e).then(function(e){t.getWaypoints()}).catch(function(e){console.log(e)})}},{key:"convertTime",value:function(e){var t=new Date(1e3*e),a=t.getFullYear(),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()];return t.getDate()+" "+n+" "+a+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(y.a,{onClick:function(){return e.getWaypoints()},bsSize:"small"},l.a.createElement(w.a,{glyph:"refresh"})),l.a.createElement("br",null),l.a.createElement(B.a,{striped:!0,bordered:!0,condensed:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Bird Name"),l.a.createElement("th",null,"RFID"),l.a.createElement("th",null,"Feeder Name"),l.a.createElement("th",null,"Date and Time"),l.a.createElement("th",null,"Actions"))),l.a.createElement("tbody",null,this.buildRows())))}}]),t}(n.Component),x=function(e){function t(e,a){var n;return Object(c.a)(this,t),n=Object(o.a)(this,Object(u.a)(t).call(this,e,a)),v.a.interceptors.response.use(function(e){return e},function(e){401===e.response.status&&(console.log("INFO: CAUGHT 401"),n.setState({redirect:!0}))}),n.handleSelect=n.handleSelect.bind(Object(b.a)(Object(b.a)(n))),n.updateFilter=n.updateFilter.bind(Object(b.a)(Object(b.a)(n))),n.state={key:1,redirect:!1,locationFilter:{latitude:"0",longitude:"0"}},n}return Object(s.a)(t,e),Object(d.a)(t,[{key:"handleSelect",value:function(e){this.setState({key:e})}},{key:"handleRedirect",value:function(){if(this.state.redirect)return l.a.createElement(g.a,{to:"/login/"})}},{key:"updateFilter",value:function(e){this.setState({locationFilter:e}),console.log(e)}},{key:"render",value:function(){return l.a.createElement("div",{id:"index"},this.handleRedirect(),l.a.createElement("br",null),l.a.createElement(f.a,{activeKey:this.state.key,onSelect:this.handleSelect,id:"main-tabs"},l.a.createElement(p.a,{eventKey:1,title:"Birds"},l.a.createElement(N,null)),l.a.createElement(p.a,{eventKey:2,title:"Feeders"},l.a.createElement(L,{locationFilter:this.state.locationFilter})),l.a.createElement(p.a,{eventKey:3,title:"Events"},l.a.createElement(A,{locationFilter:this.state.locationFilter})),l.a.createElement(p.a,{eventKey:4,title:"Waypoints"},l.a.createElement(M,{locationFilter:this.state.locationFilter}))))}}]),t}(n.Component),U=a(150),J=function(e){function t(e,a){var n;return Object(c.a)(this,t),(n=Object(o.a)(this,Object(u.a)(t).call(this,e,a))).handleUsernameChange=n.handleUsernameChange.bind(Object(b.a)(Object(b.a)(n))),n.handlePasswordChange=n.handlePasswordChange.bind(Object(b.a)(Object(b.a)(n))),n.handleSubmit=n.handleSubmit.bind(Object(b.a)(Object(b.a)(n))),n.state={username:"",password:"",showAlert:!1,redirect:!1},n}return Object(s.a)(t,e),Object(d.a)(t,[{key:"handleUsernameChange",value:function(e){this.setState({username:e.target.value})}},{key:"handlePasswordChange",value:function(e){this.setState({password:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var a={username:this.state.username,password:this.state.password};v.a.post("/api/login",a).then(function(e){console.log(e),console.log("Login successful."),t.setState({redirect:!0})}).catch(function(e){console.log("Authentication failed!"),console.log(e),t.setState({showAlert:!0})})}},{key:"handleRedirect",value:function(){if(this.state.redirect)return l.a.createElement(g.a,{to:"/"})}},{key:"renderAlert",value:function(){if(this.state.showAlert)return l.a.createElement(U.a,{bsStyle:"danger"},"Username / password not found.")}},{key:"render",value:function(){return l.a.createElement("div",null,this.renderAlert(),this.handleRedirect(),l.a.createElement("form",{id:"login-form"},l.a.createElement(k.a,{controlId:"username"},l.a.createElement(S.a,null,"Username"),l.a.createElement(C.a,{type:"text",value:this.state.username,placeholder:"",onChange:this.handleUsernameChange})),l.a.createElement(k.a,{controlId:"password"},l.a.createElement(S.a,null,"Password"),l.a.createElement(C.a,{type:"password",value:this.state.password,placeholder:"",onChange:this.handlePasswordChange})),l.a.createElement(y.a,{type:"submit",onClick:this.handleSubmit},"Log In")))}}]),t}(n.Component),T=(a(135),function(e){function t(){return Object(c.a)(this,t),Object(o.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return l.a.createElement(h.a,{basename:"/admin"},l.a.createElement("div",{id:"App",className:"container"},l.a.createElement("h1",null,"FeederNet Admin"),l.a.createElement("br",null),l.a.createElement(m.a,{path:"/",exact:!0,component:x}),l.a.createElement(m.a,{path:"/login/",component:J})))}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},66:function(e,t,a){e.exports=a(137)},71:function(e,t,a){}},[[66,2,1]]]);
//# sourceMappingURL=main.6aa1395d.chunk.js.map