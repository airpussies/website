(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{UpPj:function(e,a,t){"use strict";t.r(a),t.d(a,"pageQuery",(function(){return o}));var n=t("dI71"),r=t("q1tI"),s=t.n(r),i=t("Bl7J"),l=t("n7XF"),c=function(e){function a(){return e.apply(this,arguments)||this}return Object(n.a)(a,e),a.prototype.render=function(){var e,a,t=this.props.data.contentfulTurnierbericht,n=t.title,r=t.date,c=t.description,o=t.report,m=t.fieldType,d=t.division,p=t.location;return null!==o&&""!==o.childMarkdownRemark.html&&(e=s.a.createElement("div",null,s.a.createElement("h2",{className:"subtitle is-2"},"Turnierberichte"),s.a.createElement("div",{dangerouslySetInnerHTML:{__html:o.childMarkdownRemark.html.replaceAll("h1","h3")}}))),null!==c&&""!==c.childMarkdownRemark.html&&(a=s.a.createElement("div",null,s.a.createElement("h2",{className:"subtitle is-2"},"Turnierbeschreibung"),s.a.createElement("div",{dangerouslySetInnerHTML:{__html:c.childMarkdownRemark.html}}))),s.a.createElement(i.a,null,s.a.createElement("h1",{className:"is-1 title"},n),s.a.createElement(l.a,{date:r,location:p,fieldType:m,division:d}),s.a.createElement("div",{className:"wrapper"},a,e))},a}(s.a.Component);a.default=c;var o="2808292301"},n7XF:function(e,a,t){"use strict";t.d(a,"a",(function(){return l}));var n=t("dI71"),r=t("q1tI"),s=t.n(r),i=function(e){function a(){return e.apply(this,arguments)||this}return Object(n.a)(a,e),a.prototype.render=function(){var e="",a=this.props.division.split(";");return(a.includes("mixed")||a.includes("soft mixed"))&&(e+="⚥"),a.includes("women")&&(e+="♀"),a.includes("open")&&(e+="♂"),s.a.createElement("span",null,e)},a}(s.a.Component),l=function(e){function a(){return e.apply(this,arguments)||this}return Object(n.a)(a,e),a.prototype.render=function(){var e=this.props.date,a=this.props.location,t=this.props.fieldType,n=this.props.division;return s.a.createElement("div",{className:"field is-grouped is-grouped-multiline"},s.a.createElement("div",{className:"control"},s.a.createElement("div",{className:"tags has-addons"},s.a.createElement("span",{className:"tag is-dark"},"Datum"),s.a.createElement("span",{className:"tag is-primary"},e))),s.a.createElement("div",{className:"control"},s.a.createElement("div",{className:"tags has-addons"},s.a.createElement("span",{className:"tag is-dark"},"Ort"),s.a.createElement("span",{className:"tag is-primary"},a))),s.a.createElement("div",{className:"control"},s.a.createElement("div",{className:"tags has-addons"},s.a.createElement("span",{className:"tag is-dark"},"Untergrund"),s.a.createElement("span",{className:"tag is-primary"},t))),s.a.createElement("div",{className:"control"},s.a.createElement("div",{className:"tags has-addons"},s.a.createElement("span",{className:"tag is-dark"},"Division"),s.a.createElement("span",{className:"tag is-primary"},s.a.createElement(i,{division:n})," ",n))))},a}(s.a.Component)}}]);
//# sourceMappingURL=component---src-templates-report-js-61d0932572de3cf08bff.js.map