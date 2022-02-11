(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{134:function(e,t,n){e.exports=n(245)},139:function(e,t,n){},140:function(e,t,n){e.exports=n.p+"static/media/logo.06e73328.svg"},141:function(e,t,n){},148:function(e,t){},150:function(e,t){},160:function(e,t){},162:function(e,t){},189:function(e,t){},191:function(e,t){},192:function(e,t){},197:function(e,t){},199:function(e,t){},205:function(e,t){},207:function(e,t){},226:function(e,t){},238:function(e,t){},241:function(e,t){},245:function(e,t,n){"use strict";n.r(t);var s=n(0),a=n.n(s),r=n(132),o=n.n(r),i=(n(139),n(3)),u=n(4),l=n(8),c=n(9),h=(n(140),n(141),n(40)),d=n(1),p=n.n(d),m=n(6),g=n(25),b=(s.Component,function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var s;return Object(i.a)(this,n),(s=t.call(this,e)).state={cheating:!1},s}return Object(u.a)(n,[{key:"getNumberOfCorrectOptions",value:function(){var e=0,t=0;for(t=0;t<this.props.question.options.length;t++)this.props.question.options[t].correct&&e++;return e}},{key:"getRadioOrCheckboxType",value:function(){return this.getNumberOfCorrectOptions(),"checkbox"}},{key:"toggleOption",value:function(e){try{var t=this.props.question.options[e].selected;this.props.question.options[e].selected=!t,this.props.saveQuestionState(this.props.question)}catch(n){console.log(n)}}},{key:"isAnsweredCorrectly",value:function(){var e=0;for(e=0;e<this.props.question.options.length;e++)if(this.props.question.options[e].correct!=this.props.question.options[e].selected)return"false";return"true"}},{key:"isDisabled",value:function(){return 1==this.props.disabled}},{key:"getAnswer",value:function(){return a.a.createElement("div",{class:"btn-warning",dangerouslySetInnerHTML:{__html:this.props.question.answer}})}},{key:"highlightAnswer",value:function(e){return console.log(this.props.graded),(this.props.cheating||this.props.disabled)&&(console.log("We are cheating or it is graded."),this.props.question.options[e].correct)?(console.log("The option is correct.")," border border-success "):""}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{class:"card-body"},a.a.createElement("h3",{class:"card-title",id:"query"},this.props.question.query," ",a.a.createElement("small",null,"(Choose ",this.getNumberOfCorrectOptions(),")")),this.props.question.options.map(function(t,n){return a.a.createElement("div",{class:"form-check my-2 "+e.highlightAnswer(n),id:"outerOptionDiv"+n},a.a.createElement("input",{class:"form-check-input  option-radio ",type:e.getRadioOrCheckboxType(),name:"optionRadios",id:"option"+n,value:"option"+n,checked:e.props.question.options[n].selected,disabled:e.isDisabled(),onClick:function(){return e.toggleOption(n)}}),a.a.createElement("label",{class:"form-check-label",for:"option"+n,id:"labelOption"+n},e.props.question.options[n].text))}))}}]),n}(s.Component)),f=(s.Component,function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){return Object(i.a)(this,n),t.call(this,e)}return Object(u.a)(n,[{key:"changeQuestion",value:function(){this.props.setCurrentQuestion(this.props.indexNumber)}},{key:"render",value:function(){var e=this;return a.a.createElement("span",null,a.a.createElement("button",{id:"btn{this.props.questionNumber}",type:"button",class:this.getClass(),onClick:function(){return e.changeQuestion()}},this.props.indexNumber+1,console.log(this.props.questions[this.props.indexNumber].getAnswer)),"\xa0")}},{key:"getClass",value:function(){var e="btn btn-light btn-sm";try{this.props.questions[this.props.indexNumber].viewed&&(e="btn btn-secondary btn-sm")}catch(s){console.error(s)}[this.props.indexNumber]==this.props.currentQuestionNumber&&(e="btn btn-primary btn-sm");var t=0,n=!0;for(t=0;t<this.props.question.options.length;t++)this.props.question.options[t].correct!=this.props.question.options[t].selected&&(n=!1);return(this.props.cheating||this.props.graded)&&(n||(e="btn btn-danger btn-sm"),n&&(e="btn btn-success btn-sm")),e}}]),n}(s.Component)),v=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){return Object(i.a)(this,n),t.call(this,e)}return Object(u.a)(n,[{key:"isQuestionAnsweredCorrectly",value:function(e){var t=0;for(t=0;t<e.options.length;t++)if(e.options[t].correct!==e.options[t].selected)return!1;return!0}},{key:"getCurrentQuestion",value:function(){try{return null==this.props.questions?(console.log("Questions are null."),null):this.props.questions[this.props.currentQuestionNumber]}catch(e){return console.error("Error trying to return current question"+e),null}}},{key:"changeQuestion",value:function(){this.props.setCurrentQuestion(this.props.indexNumber)}},{key:"nextQuestion",value:function(){this.props.setCurrentQuestion(this.props.currentQuestionNumber+1)}},{key:"previousQuestion",value:function(){this.props.setCurrentQuestion(this.props.currentQuestionNumber-1)}},{key:"getEnabledOrDisabledButtonState",value:function(e){return e?" enabled btn btn-primary ":" disabled btn btn-primary "}},{key:"setPreviousButtonState",value:function(){var e=this.props.currentQuestionNumber>0;return this.getEnabledOrDisabledButtonState(e)}},{key:"setNextButtonState",value:function(){var e=this.props.currentQuestionNumber<this.props.questions.length-1;return this.getEnabledOrDisabledButtonState(e)}},{key:"setFinishButtonState",value:function(){var e=!this.props.graded;return this.getEnabledOrDisabledButtonState(e)}},{key:"getCheatButton",value:function(){var e=this;if(!this.props.disabled)return a.a.createElement("a",{id:"cheat",className:(this.props.cheating,"enabled btn btn-warning"),onClick:function(){return e.props.toggleCheat()}},this.props.cheating?"Be Honest":"Cheat")}},{key:"getFinishButton",value:function(){var e=this;if(!this.props.disabled)return a.a.createElement("a",{id:"finish",className:this.setFinishButtonState(),onClick:function(){return e.props.gradeTheExam()}},"Finish")}},{key:"render",value:function(){var e=this,t=null;if(null==this.getCurrentQuestion())return a.a.createElement("div",{class:"card  mt-3"},a.a.createElement("div",{class:"card-header d-flex justify-content-between",id:"questionNumber"},"Loading...",a.a.createElement("a",{id:"cheat",class:" enabled btn btn-warning "},"Cheat")),a.a.createElement("div",{class:"card-body"},a.a.createElement("div",{class:"card-body"},"Loading...")));console.log("The current question: "+JSON.stringify(this.getCurrentQuestion()));var n=this.getCurrentQuestion();return console.log(n.query),!0===this.props.cheating&&(t=a.a.createElement("div",{className:"card  mt-3"},a.a.createElement("div",{className:"card-header d-flex justify-content-between",id:"questionNumber"},"Answer"),a.a.createElement("div",{className:"card-body"},a.a.createElement("div",{className:"card-text    d-flex justify-content-between "},a.a.createElement("span",{dangerouslySetInnerHTML:{__html:n.answer}}))))),a.a.createElement("span",{style:"width:100%"},a.a.createElement("div",{className:"card  mt-3"},a.a.createElement("div",{className:"card-header d-flex justify-content-between",id:"questionNumber"},"Question ",this.props.currentQuestionNumber+1,this.getCheatButton()),a.a.createElement("div",{className:"card-body"},a.a.createElement(b,{saveQuestionState:this.props.saveQuestionState,question:this.getCurrentQuestion(),disabled:this.props.disabled,cheating:this.props.cheating}),a.a.createElement("div",{className:"card-text mt-3   d-flex justify-content-between "},a.a.createElement("span",null,a.a.createElement("a",{id:"previous",className:this.setPreviousButtonState(),onClick:function(){return e.previousQuestion()}},"<< Back"),"\xa0",a.a.createElement("a",{id:"next",className:this.setNextButtonState(),onClick:function(){return e.nextQuestion()}},"Next >>")," \xa0"),a.a.createElement("span",null,this.getFinishButton())))),t)}}]),n}(s.Component),y=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){return Object(i.a)(this,n),t.call(this,e)}return Object(u.a)(n,[{key:"getCurrentQuestion",value:function(){try{return null==this.props.questions?(console.log("Questions are null."),null):this.props.questions[this.props.currentQuestionNumber]}catch(e){return console.error("Error trying to return current question"+e),null}}},{key:"render",value:function(){var e=this;return null==this.getCurrentQuestion()?a.a.createElement("div",{class:"card  mt-3"},a.a.createElement("div",{class:"card-header d-flex justify-content-between",id:"questionNumber"},"Loading...",a.a.createElement("a",{id:"cheat",class:" enabled btn btn-warning "},"Cheat")),a.a.createElement("div",{class:"card-body"},a.a.createElement("div",{class:"card-body"},"Loading..."))):a.a.createElement("div",{class:"card  mt-3 mb-3 "},a.a.createElement("div",{class:"card-header d-flex justify-content-between align-items-center",id:"questionJumperTitle",onClick:function(){return e.toggleWindow()}},"Question Jumper",a.a.createElement("svg",{id:"caret",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-caret-up",viewBox:"0 0 16 16"},a.a.createElement("path",{d:"M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"}))),a.a.createElement("div",{id:"jumper-card-body",class:"card-body"},a.a.createElement("p",{class:"card-text"}),a.a.createElement("div",{id:"questionJumper"},this.props.questions.map(function(t,n){return a.a.createElement(f,{indexNumber:n,setCurrentQuestion:e.props.setCurrentQuestion,questions:e.props.questions,question:e.props.questions[n],currentQuestionNumber:e.props.currentQuestionNumber,cheating:e.props.cheating,graded:e.props.graded,toggleMarked:e.props.toggleMarked})}))))}},{key:"toggleWindow",value:function(){var e=document.getElementById("jumper-card-body"),t=document.getElementById("caret");"none"===e.style.display?(e.style.display="block",t.innerHTML='<path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>'):(e.style.display="none",t.innerHTML='<path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>')}}]),n}(s.Component),E=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var s;return Object(i.a)(this,n),(s=t.call(this,e)).state={hasError:!1},s}return Object(u.a)(n,[{key:"clearLocalStorage",value:function(){localStorage.clear("examHistory"),this.getExamHistory()}},{key:"getExamHistory",value:function(){try{var e=localStorage.getItem("examHistory"),t="";if(null==e){(t={name:"Exam History"}).exams=[],localStorage.setItem("examHistory",JSON.stringify(t))}else t=JSON.parse(e);return t}catch(n){console.log(n)}}},{key:"render",value:function(){var e=this;console.log("In ExamHistoryPanel render"),console.log(this.getExamHistory()),console.log(this.getExamHistory().exams);var t=this.getExamHistory();return null==t?a.a.createElement("span",null,"No Exam History"):null==t.exams?a.a.createElement("span",null,"No Exams"):0==t.exams.length?a.a.createElement("span",null):this.state.hasError?a.a.createElement("h1",null,"Something went wrong."):a.a.createElement("div",{class:"card  mt-3 mb-3 "},a.a.createElement("div",{class:"card-header d-flex justify-content-between align-items-center",id:"questionJumperTitle",onClick:function(){return e.toggleWindow()}},a.a.createElement("span",null,"Exam History \xa0",a.a.createElement("a",{id:"clearls",class:"",type:"submit",onClick:function(){return e.clearLocalStorage()}},"Clear History")),a.a.createElement("svg",{id:"history-caret",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-caret-up",viewBox:"0 0 16 16"},a.a.createElement("path",{d:"M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"}))),a.a.createElement("div",{id:"history-card-body",class:"card-body"},a.a.createElement("p",{class:"card-text"}),a.a.createElement("div",{id:"historyJumper"},this.getExamHistory().exams.map(function(t,n){var s=t.questions.map(function(t,n){return a.a.createElement("span",null,e.getButton(t))});return s.unshift(a.a.createElement("br",null)),s.unshift(t.name),s.push(a.a.createElement("hr",null)),s}))))}},{key:"componentDidCatch",value:function(e,t){this.setState({hasError:!0})}},{key:"getButton",value:function(e){var t="btn btn-warning btn-sm",n=0,s=!0;for(n=0;n<e.options.length;n++)e.options[n].correct!=e.options[n].selected&&(s=!1);return s||(t=a.a.createElement("span",null,a.a.createElement("button",{class:"btn btn-info"},a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-x-square",viewBox:"0 0 16 16"},a.a.createElement("path",{d:"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"}),a.a.createElement("path",{d:"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"}))),"\xa0")),s&&(t=a.a.createElement("span",null,a.a.createElement("button",{class:"btn btn-primary"},a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-check-square",viewBox:"0 0 16 16"},a.a.createElement("path",{d:"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"}),a.a.createElement("path",{d:"M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"}))),"\xa0")),t}},{key:"getClass",value:function(e){var t="btn btn-warning btn-sm",n=0,s=!0;for(n=0;n<e.options.length;n++)e.options[n].correct!=e.options[n].selected&&(s=!1);return s||(t="btn btn-danger btn-sm"),s&&(t="btn btn-info btn-sm"),t}},{key:"toggleWindow",value:function(){var e=document.getElementById("history-card-body"),t=document.getElementById("history-caret");"none"===e.style.display?(e.style.display="block",t.innerHTML='<path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>'):(e.style.display="none",t.innerHTML='<path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>')}}]),n}(s.Component),x=new h.a({id:"exam-app-vzpmu"}),k=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var s;Object(i.a)(this,n),console.log("Hello World"),(s=t.call(this,e)).saveQuestionState=s.saveQuestionState.bind(Object(g.a)(s)),s.gradeTheExam=s.gradeTheExam.bind(Object(g.a)(s)),s.setCurrentQuestion=s.setCurrentQuestion.bind(Object(g.a)(s)),s.showGrade=!1,s.elapsedTime=0,s.toggleCheat=s.toggleCheat.bind(Object(g.a)(s));var a=new Date,r=JSON.parse(localStorage.getItem("currentExam")),o=!1;return console.log("This is the page prop: "+s.props.page),"answer"==s.props.page&&(o=!0),null!=r&&"answer"!=s.props.page?(console.log("We found a currentExam!!! The questions are:"),console.log(r.questions),s.state={name:s.props.name,graded:!1,username:"kaisersose",start:a.getTime(),finish:0,questions:r.questions,currentQuestionNumber:0,cheating:!1}):s.state={name:s.props.name,graded:!1,username:"kaisersose",start:a.getTime(),finish:0,currentQuestionNumber:0,cheating:o},s}return Object(u.a)(n,[{key:"componentDidMount",value:function(){null==this.state.questions&&this.getExamQuestions()}},{key:"getExamQuestions",value:function(){var e=Object(m.a)(p.a.mark(function e(){var t,n,s,a;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("in getExamQuestions()"),e.next=3,x.logIn(h.b.anonymous());case 3:return e.sent,t=x.currentUser.mongoClient("mongodb-atlas"),n=t.db("ceasars-club").collection("practitioner"),console.log("Hello"),console.log(n),console.log("About to find questions in: "+this.props.message),'{ "quid" : { "$in" : [56,57,58,59,66,76,65,67] } }',s=this.props.message,e.next=13,n.find(JSON.parse(s));case 13:a=e.sent,console.log(a),this.setState({questions:a}),this.setCurrentQuestion(0);case 17:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"setCurrentQuestion",value:function(e){this.setState({currentQuestionNumber:e}),this.state.questions[e].viewed=!0,this.saveQuestionState(this.state.questions[e]),localStorage.setItem("currentExam",JSON.stringify(this.state))}},{key:"toggleMarked",value:function(){console.log("In toggleMarked")}},{key:"saveQuestionState",value:function(e){var t=this.state.questions;t[this.currentQuestionNumber]=e,this.setState({questions:t})}},{key:"isQuestionAnsweredCorrectly",value:function(e){var t=0;for(t=0;t<e.options.length;t++)if(e.options[t].correct!=e.options[t].selected)return!1;return!0}},{key:"getCorrectCount",value:function(){var e=0,t=0;for(t=0;t<this.state.questions.length;t++)this.isQuestionAnsweredCorrectly(this.state.questions[t])&&e++;return e}},{key:"gradeTheExam",value:function(){var e=this,t=new Date,n=(this.getCorrectCount(),this.getExamHistory());this.setState({graded:!0},function(){}),this.showGrade=!0,this.setState({cheating:!0},function(){}),this.setState({finish:t.getTime()},function(){n.exams.push(e.state),localStorage.setItem("examHistory",JSON.stringify(n))}),localStorage.removeItem("currentExam")}},{key:"getExamHistory",value:function(){try{var e=localStorage.getItem("examHistory"),t="";if(null==e){(t={name:"Exam History"}).exams=[],localStorage.setItem("examHistory",JSON.stringify(t))}else t=JSON.parse(e);return t}catch(n){console.log(n)}}},{key:"componentDidUpdate",value:function(){this.showGrade=!1}},{key:"toggleCheat",value:function(){this.setState({cheating:!this.state.cheating})}},{key:"save",value:function(){var e=this;console.log("In save"),console.log("Posting with the following JSON: "+JSON.stringify(this.state)),console.log("COMPONENT DID MOUNT!"),console.log("About to fetch"),fetch("http://localhost:8080/exam",{method:"POST",body:JSON.stringify(this.state)}).then(function(e){return e.json()}).then(function(t){e.setState(t),JSON.stringify(t._id),console.log(t.toString());var n=t._id.$oid;e.setState({mongoid:n}),console.log("OID is: "+t._id.$oid),console.log("The current state is now: "+JSON.stringify(e.state))}).catch(console.log)}},{key:"showResults",value:function(){if(this.state.graded)return a.a.createElement("div",{class:"card mt-2"},a.a.createElement("div",{class:"card-header d-flex justify-content-between align-items-center",id:"resultsTitle"},"Your grade is ",this.getCorrectCount()," out of ",this.state.questions.length,"."),a.a.createElement("div",{id:"resultsbody",class:"card-body"},a.a.createElement("p",{class:"card-text"},"Learn more about every question asked."),a.a.createElement("ul",null,a.a.createElement("li",null,"Short explainations of each question are below."),a.a.createElement("li",null,"Full explainations are linked in the answer."),a.a.createElement("li",null,"Each question has a Twitter link for discussion"),a.a.createElement("li",null,"Videos and tutorials covering these examination topics are available through the site."))))}},{key:"render",value:function(){var e,t=null;return e=a.a.createElement(y,{setCurrentQuestion:this.setCurrentQuestion,toggleMarked:this.toggleMarked,currentQuestionNumber:this.state.currentQuestionNumber,questions:this.state.questions,cheating:this.state.cheating,graded:this.state.graded}),"answer"!=this.props.page&&(t=a.a.createElement(E,{setCurrentQuestion:this.setCurrentQuestion,toggleMarked:this.toggleMarked,currentQuestionNumber:this.state.currentQuestionNumber,questions:this.state.questions,cheating:this.state.cheating,graded:this.state.graded})),a.a.createElement("div",{class:"container"},this.showResults(),a.a.createElement(v,{questions:this.state.questions,currentQuestionNumber:this.state.currentQuestionNumber,disabled:this.state.graded,cheating:this.state.cheating,toggleCheat:this.toggleCheat,toggleMarked:this.toggleMarked,saveQuestionState:this.saveQuestionState,setCurrentQuestion:this.setCurrentQuestion,gradeTheExam:this.gradeTheExam,page:this.props.page}),e,t)}}]),n}(a.a.Component),w=(new h.a({id:"exam-app-vzpmu"}),function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var s;return Object(i.a)(this,n),console.log("In App Constructor."),(s=t.call(this,e)).setState({message:C.getAttribute("data-param")}),console.log(C.getAttribute("data-param")),s}return Object(u.a)(n,[{key:"render",value:function(){return a.a.createElement("div",{className:"App",message:C.getAttribute("data-param"),name:C.getAttribute("data-name")},a.a.createElement(k,{page:C.getAttribute("data-page"),message:C.getAttribute("data-param"),name:C.getAttribute("data-name")}),this.props.message)}}]),n}(a.a.Component)),C=document.getElementById("root"),q=w,N=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,246)).then(function(t){var n=t.getCLS,s=t.getFID,a=t.getFCP,r=t.getLCP,o=t.getTTFB;n(e),s(e),a(e),r(e),o(e)})};n(244);o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(q,null)),document.getElementById("root")),N()}},[[134,1,2]]]);
//# sourceMappingURL=main.0032859d.chunk.js.map