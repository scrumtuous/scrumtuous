---
layout: drag-and-drop
title:  "Externalizing CSS, JavaScript and HTML Files Examle"
blurb: "Here's how to externalize JavaScript and CSS from your HTML."
date:   2022-01-01 10:17:00 -0500
categories: aws exam
canonical: http://www.scrumtuous.com/aws/exam/2022/01/01/css-javascript-html-files.html
keywords: HTML CSS JavaScript AWS Certification Practitioner
---
	
			
<div style="border: 1px solid #DEDEDE;" class="main col col-12 col-sm-12  col-md-12 col-lg-12 order-1 order-sm-1 order-lg-1 mb-3 mt-3">


<div class="quiz-wrapper mt-3 mb-3" style="background: #FEFEFE;">
<h2 style="color:#FAFAFA"><span class="section-title" >Roshambo Code Challenge</span></h2>




<div class="row mt-3 mb-3">

	<div class="col-xs-12 col-sm-6 col-md-5">

		<h2 class="mt-2 mb-3" >Here's the CSS, HTML and JavaScriptassignment.</h2>
<p class="mb-3 bt-4">If you want to pass the <a href="https://aws.amazon.com/certification/">AWS Certification exams</a>, you need to know a little bit of code. Not a lot, but you do need to know your way around web pages, Java files and modern data exchange formats like YAML and JSON.</p>
		<ol class="section-ol">
		<li class="section-li"><i class="lni lni-checkmark"></i>Drag from the left to the right to sort the scrambled Rock-Paper-Scissors code.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>The code will fall into one of three files: index.html, style.css and script.js.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Save all three files on your desktop.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Open your index.html file in Chrome and view your page in a web browser!</li>
<li class="section-li"><i class="lni lni-checkmark"></i>You should always <a href="https://html-lint.com/">lint</a> your code when you get it to work.</li>
<li class="section-li"><i class="lni lni-checkmark"></i>Right-click and choose 'Inspect' in your browser to see your source code and view any console output.</li>
		
		</ol>	
		<figure>
		<img src="/assets/main-style-css-html.png" alt="JavaScript, CSS and HTML for AWS Exam" class="img-fluid mx-auto d-block img-thumbnail rounded" />
		<figcaption>Here's what the styled and scripted HTML example looks like.</figcaption>
		</figure>
		
		
	</div>

	<div class="col-xs-12 col-sm-6 col-md-7">
	
	<h3 style="color:#FAFAFA" class="mt-2 mb-3"><span class="section-title" >The RAW WebPage</span></h3>
<p>Here's what the latest edition of the number guesser game looks like, with JavaScript, styles and HTML all mixed into one file.</p>
<p>It is an anti-pattern to combine style, structure and script all in one file.</p> 
<p>Style, structure and JavaScript should be separated out into .css, .html and .js files for easier management.</p>


<pre style="color:black; background-color:silver">
&lt;html&gt;

  &lt;head&gt;
    &lt;title&gt;The Number Guesser Game&lt;/title&gt;
	&lt;style&gt;
	body {padding:50; font-family:sans-serif;}
	button {background: linear-gradient(45deg, #6831e3, #f528cb);}
	h3 {color:navy}
	.display {
         background: silver;
		 color:white;
         text-align: center;
		 margin-top: 10px;
		 font-size: 1.5em; 
         }
	&lt;/style&gt;
  &lt;/head&gt;

  &lt;body&gt;
    &lt;h3&gt;Want to play a game?&lt;/h3&gt;
    &lt;p&gt;Pick a number between &lt;b&gt;1&lt;/b&gt; and &lt;b&gt;5&lt;/b&gt;? &lt;/p&gt;
    &lt;button onclick=&quot;playTheGame(&#39;1&#39;)&quot;&gt; 1 &lt;/button&gt; &amp;nbsp;
    &lt;button onclick=&quot;playTheGame(&#39;2&#39;)&quot;&gt; 2 &lt;/button&gt; &amp;nbsp;
    &lt;button onclick=&quot;playTheGame(&#39;3&#39;)&quot;&gt; 3 &lt;/button&gt; &amp;nbsp;
    &lt;button onclick=&quot;playTheGame(&#39;4&#39;)&quot;&gt; 4 &lt;/button&gt; &amp;nbsp;
    &lt;button onclick=&quot;playTheGame(&#39;5&#39;)&quot;&gt; 5 &lt;/button&gt; &amp;nbsp;
    &lt;div id=&quot;results&quot; class=&quot;display&quot;&gt;Results will appear here.&lt;/div&gt;
    &lt;script&gt;
      var magicNumber = Math.floor(Math.random() * 5);
      playTheGame = function(guess) {
        var response = &quot;Nope. It&#39;s not &quot; + guess;
        if (guess &gt; magicNumber) {
          response = response + &quot;. Guess Lower!&quot;;
        } // close guess lower if
        if (guess &lt; magicNumber) {
          response = response + &quot;. Guess Higher!&quot;
        } // close guess higher if
        if (guess == magicNumber) {
          response = &quot;You got it correct!&quot;
          response += &quot; The number was &quot; + magicNumber + &quot;.&quot;;
          magicNumber = Math.floor(Math.random() * 5);
        } // end the if
        document.getElementById(&#39;results&#39;).innerHTML = response;
      } // end the method
    &lt;/script&gt;
  &lt;/body&gt;

&lt;/html&gt;

</pre>

	</div>


</div>




<h3>WARNING: The dragging and dropping function doesn't work great on handhelds.</h3>
    <div class="row mt-3 mb-3">

<div class="row mt-3 mb-3">
	<div class="col-xs-12 col-sm-6 "></div>
	<div class="col-xs-12 col-sm-6 "></div>
</div>


<div class="col-xs-12 col-sm-6  dragitems">
		 
<div class="unsorted w-100">
	 
<ul class="options w-100 p-3">
<li class="title title-sorted">index.html</li>

<li class="option" data-target="16"><span class="option-data"> &lt;/body&gt; </span></li>
<li class="option" data-target="10"><span class="option-data"> &lt;button onclick=&quot;playTheGame(&#39;2&#39;)&quot;&gt; 2 &lt;/button&gt; &amp;nbsp; </span></li>
<li class="option" data-target="6"><span class="option-data"> &lt;body&gt; </span></li>

<li class="option" data-target="13"><span class="option-data"> &lt;button onclick=&quot;playTheGame(&#39;5&#39;)&quot;&gt; 5 &lt;/button&gt; &amp;nbsp; </span></li>
<li class="option" data-target="7"><span class="option-data"> &lt;h3&gt;Want to play a game?&lt;/h3&gt; </span></li>
<li class="option" data-target="17"><span class="option-data"> &lt;/html&gt; </span></li>
<li class="option" data-target="3"><span class="option-data"> &lt;title&gt;The Number Guesser Game&lt;/title&gt; </span></li>
<li class="option" data-target="15"><span class="option-data">  &lt;script src=&quot;script.js&quot;&gt;&lt;/script&gt; </span></li>
<li class="option" data-target="12"><span class="option-data"> &lt;button onclick=&quot;playTheGame(&#39;4&#39;)&quot;&gt; 4 &lt;/button&gt; &amp;nbsp; </span></li>
<li class="option" data-target="4"><span class="option-data"> &lt;link rel=stylesheet href=&quot;style.css&quot;&gt; </span></li>



<li class="option" data-target="1"><span class="option-data"> &lt;html&gt; </span></li>
<li class="option" data-target="8"><span class="option-data"> &lt;p&gt;Pick a number between &lt;b&gt;1&lt;/b&gt; and &lt;b&gt;5&lt;/b&gt;? &lt;/p&gt; </span></li>
<li class="option" data-target="9"><span class="option-data"> &lt;button onclick=&quot;playTheGame(&#39;1&#39;)&quot;&gt; 1 &lt;/button&gt; &amp;nbsp; </span></li>
<li class="option" data-target="5"><span class="option-data"> &lt;/head&gt; </span></li>
<li class="option" data-target="11"><span class="option-data"> &lt;button onclick=&quot;playTheGame(&#39;3&#39;)&quot;&gt; 3 &lt;/button&gt; &amp;nbsp; </span></li>
<li class="option" data-target="2"><span class="option-data"> &lt;head&gt; </span></li>
<li class="option" data-target="14"><span class="option-data"> &lt;div id=&quot;results&quot; class=&quot;display&quot;&gt;Results appear here.&lt;/div&gt; </span></li>




<li><hr/></li>



<li class="title title-sorted">style.css</li>

<li class="option" data-target="19"><span class="option-data"> button {background: linear-gradient(45deg, #6831e3, #f528cb);} </span></li>
<li class="option" data-target="23"><span class="option-data"> color:white; </span></li>
<li class="option" data-target="18"><span class="option-data"> body {padding:50; font-family:sans-serif;} </span></li>

<li class="option" data-target="22"><span class="option-data"> background: silver; </span></li>
<li class="option" data-target="26"><span class="option-data"> font-size: 1.5em; </span></li>


<li class="option" data-target="21"><span class="option-data"> .display { </span></li>

<li class="option" data-target="27"><span class="option-data"> } </span></li>

<li class="option" data-target="25"><span class="option-data"> margin-top: 10px; </span></li>

<li class="option" data-target="20"><span class="option-data"> h3 {color:navy} </span></li>

<li class="option" data-target="24"><span class="option-data"> text-align: center; </span></li>





<li class="title title-sorted">script.js</li>

<li class="option" data-target="32"><span class="option-data"> response = response + &quot;. Guess Lower!&quot; </span></li>
<li class="option" data-target="39"><span class="option-data"> document.getElementById(&#39;results&#39;).innerHTML = response; </span></li>
<li class="option" data-target="38"><span class="option-data"> } </span></li>
<li class="option" data-target="35"><span class="option-data"> if (guess == magicNumber) { </span></li>
<li class="option" data-target="40"><span class="option-data"> } // end the method </span></li>
<li class="option" data-target="29"><span class="option-data"> playTheGame = function(guess) { </span></li>
<li class="option" data-target="34"><span class="option-data"> response = response + &quot;. Guess Higher!&quot; </span></li>

<li class="option" data-target="31"><span class="option-data"> if (guess &gt; magicNumber)  </span></li>

<li class="option" data-target="36"><span class="option-data"> response = &quot; Correct. The number was &quot; + magicNumber + &quot;.&quot; </span></li>
<li class="option" data-target="33"><span class="option-data"> if (guess &lt; magicNumber)  </span></li>
<li class="option" data-target="37"><span class="option-data"> magicNumber = Math.floor(Math.random() * 5); </span></li>

<li class="option" data-target="28"><span class="option-data"> var magicNumber = Math.floor(Math.random() * 5); </span></li>
<li class="option" data-target="30"><span class="option-data"> var response = &quot;Nope. It&#39;s not &quot; + guess; </span></li>



</ul>


</div>		 
		 
		 </div><!-- end dragitems -->

<div class="col-xs-12 col-sm-6  border-solid border-green dropitems">
		 
<div class="answers w-100">
  

<ul class="options w-100 p-3">
<li class="title title-sorted">index.html</li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="1"> Start me up! </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="2"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="3"> SEO Optimized Page title </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="4"> Script or stylesheet? </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="5"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="6"> Start the body </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="7"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="8"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="9"> Button </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="10"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="11"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="12"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="13"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="14"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="15"> Script or stylesheet? </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="16"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="17"> Put something here </span></li>
<li><hr/></li>
<li class="title title-sorted">style.css</li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="18"> Pad the page </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="19"> Make buttons purple </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="20"> Head out to sea </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="21"> A class style </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="22"> Not gold </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="23"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="24"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="25"> Put something here </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="26"> Increase font by 50% </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="27"> End class style </span></li>

<li class="title title-sorted">script.js</li>

<li class="sink"><span class="target w-100 ui-droppable" data-accept="28"> Create magic number </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="29"> Define the method </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="30"> Create a default response </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="31"> Guessed too low </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="32"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="33"> Guessed to high </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="34"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="35"> The poridge is just right </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="36"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="37"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="38"> Put something here  </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="39"> Update the HTML </span></li>
<li class="sink"><span class="target w-100 ui-droppable" data-accept="40"> End the method </span></li>


</ul>

</div>
		 
		 </div><!-- end dropitems -->
    </div>	
	
	
	


 <button type="submit" value="submit">Submit</button>
 <div class="lightbox-bg"></div>
 <div class="status confirm">
   <p>All Answers Answered</p>
 </div>
 <div class="status deny">
   <p>Answers Remain</p>
 </div>
</div>






            </div>
