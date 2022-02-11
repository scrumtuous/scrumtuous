---
layout: drag-and-drop
title:  "JavaScript, HTML & JSON for the AWS Exam with Roshambo"
blurb: "Here's the Rock Paper Scissors game with HTML, JavaScript and JSON as the data exchange format. It's a fun drag-and-drop exercise!"
date:   2022-01-01 10:17:00 -0500
categories: aws exam
canonical: http://www.scrumtuous.com/aws/exam/2022/01/01/html-javascript-rock-paper-scissors-roshambo-drag-drop.html
keywords: JavaScript AWS Practitioner Exam HTML Code Roshambo Rock Paper Scissors Drag-n-Drop

---
	
			
<div style="border: 1px solid #DEDEDE;" class="main col col-12 col-sm-12  col-md-12 col-lg-12 order-1 order-sm-1 order-lg-1 mb-3 mt-3">


<div class="quiz-wrapper mt-3 mb-3" style="background: #FEFEFE;">
<h2 style="color:#FAFAFA"><span class="section-title" >Roshambo Code Challenge</span></h2>




<div class="row mt-3 mb-3">

	<div class="col-xs-12 col-sm-6 ">

		<h2 class="mt-2 mb-3" >Here's the Roshambo coding assignment.</h2>
<p class="mb-3 bt-4">If you want to pass the <a href="https://aws.amazon.com/certification/">AWS Certification exams</a>, you need to know a little bit of code. Not a lot, but you do need to know your way around web pages, Java files and modern data exchange formats like YAML and JSON.</p>
		<ol class="section-ol">
		<li class="section-li"><i class="lni lni-checkmark"></i>Drag from the left to the right to sort the scrambled Rock-Paper-Scissors code.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>When completed, copy the Roshambo HTML and JavaScript code into Notepad++.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Save your HTML file as roshambo.html on your desktop.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Open your roshambo.html file in Chrome and view your page in a web browser!</li>
<li class="section-li"><i class="lni lni-checkmark"></i>You should <a href="https://html-lint.com/">lint</a> your code when you get it to work.</li>
		
		</ol>	

	</div>

	<div class="col-xs-12 col-sm-6 ">

		<figure>
		<img src="/assets/display-json.jpg" alt="JavaScript for AWS Exam" class="img-fluid mx-auto d-block img-thumbnail rounded" />
		<figcaption>This simply page displays JSON data about yesterday's overall score.</figcaption>
		</figure>
	</div>


</div>




<h3>WARNING: The dragging and dropping function doesn't work well on mobile.</h3>
    <div class="row mt-3 mb-3">

<div class="row mt-3 mb-3">

	<div class="col-xs-12 col-sm-6 ">
	
<h3 style="color:#FAFAFA" class="mt-2 mb-3"><span class="section-title" >Required Overview</span></h3>
<p class="mt-2 mb-3">There is a JSON file named yesterdays-totals, hosted on scrumtuous.com, that contains yesterday's totals from all visitors who played the rock-paper-scissors game. </p>
<p class="mt-2 mb-3">Look at the file yourself and see if you can decipher the contents of this complicated JSON file:<br/>
<a href="http://www.scrumtuous.com/yesterdays-totals.json">http://www.scrumtuous.com/yesterdays-totals.json</a>
</p >
<p class="mt-2 mb-3">Here's what it looks like:</p>
<pre class="mt-2 mb-3">{"wins":231,"losses":98,"ties":123}</pre>
<p class="mt-2 mb-3">JSON is the standard, data-exchange format for web pages, microservices and <a href="http://keepingscore-env.eba-x3qfnfiz.ca-central-1.elasticbeanstalk.com/score/">RESTful</a> web services.</p>
<p class="mt-2 mb-3">If we can figure out how to display the data in this JSON file in our webpage, then we can basically handle any type of data exchanges that happen over the modern web. What a delicious thought!</p>
<p class="mt-2 mb-3">Now get to work!</p>

	</div>

	<div class="col-xs-12 col-sm-6 ">
<h3 style="color:#FAFAFA" class="mt-2 mb-3"><span class="section-title" >The JSON Data</span></h3>

		<figure>
		<img src="/assets/yesterdays-totals.jpg" alt="JSON for AWS Exam" class="img-fluid mx-auto d-block img-thumbnail rounded" />
		<figcaption>JavaScript Object Notation (JSON) is the default data exchange format for the web. You'll need to know it to <a href="https://aws.amazon.com/certification/">pass</a> AWS Certification exams.</figcaption>
		</figure>



</div>

</div>


<div class="col-xs-12 col-sm-6  dragitems">
		 
<div class="unsorted w-100">
	 
<ul class="options w-100 p-3">
<li class="title title-sorted">Unsorted</li>




<li class="option" data-target="1"><span class="option-data"> &lt;html&gt; </span></li>

<li class="option" data-target="3"><span class="option-data"> &lt;body&gt;  </span></li>
<li class="option" data-target="6"><span class="option-data"> Losses: &lt;span id=&quot;losses&quot;&gt;&lt;/span&gt; &lt;br/&gt; </span></li>
<li class="option" data-target="4"><span class="option-data"> Here is yesterday&#39;s score:&lt;br/&gt; </span></li>
<li class="option" data-target="7"><span class="option-data"> Ties:   &lt;span id=&quot;ties&quot;&gt;&lt;/span&gt; &lt;br/&gt; </span></li>
<li class="option" data-target="5"><span class="option-data"> Wins:   &lt;span id=&quot;wins&quot;&gt;&lt;/span&gt; &lt;br/&gt; </span></li>
<li class="option" data-target="2"><span class="option-data"> &lt;head&gt;&lt;title&gt;Rock Paper JSON&lt;/title&gt;&lt;/head&gt; </span></li>





<li><hr/></li>

<li class="option" data-target="8"><span class="option-data"> &lt;script&gt; </span></li>

<li class="option" data-target="10"><span class="option-data"> let ajaxRequest = new XMLHttpRequest(); </span></li>

<li class="option" data-target="14"><span class="option-data">     if (this.readyState == 4 &amp;&amp; this.status == 200) { </span></li>
<li class="option" data-target="20"><span class="option-data"> }  </span></li>
<li class="option" data-target="18"><span class="option-data"> document.getElementById(&quot;losses&quot;).innerHTML = score.losses; </span></li>
<li class="option" data-target="9"><span class="option-data"> let url = &quot;http://www.scrumtuous.com/yesterdays-totals.json&quot; </span></li>
<li class="option" data-target="13"><span class="option-data"> ajaxRequest.onreadystatechange = function() { </span></li>
<li class="option" data-target="15"><span class="option-data"> 		console.log(this.responseText); </span></li>
<li class="option" data-target="12"><span class="option-data"> ajaxRequest.send(); </span></li>


<li class="option" data-target="16"><span class="option-data">         let score = JSON.parse(this.responseText); </span></li>

<li class="option" data-target="11"><span class="option-data"> ajaxRequest.open(&quot;GET&quot;, url, true); </span></li>
<li class="option" data-target="23"><span class="option-data"> &lt;/body&gt; </span></li>
<li class="option" data-target="17"><span class="option-data"> document.getElementById(&quot;wins&quot;).innerHTML = score.wins; </span></li>




<li class="option" data-target="22"><span class="option-data"> &lt;/script&gt; </span></li>
<li class="option" data-target="21"><span class="option-data"> }; // end onreadystatechange </span></li>
<li class="option" data-target="19"><span class="option-data"> document.getElementById(&quot;ties&quot;).innerHTML = score.ties; </span></li>
<li class="option" data-target="24"><span class="option-data"> &lt;/html&gt; </span></li>

</ul>


</div>		 
		 
		 </div><!-- end dragitems -->

<div class="col-xs-12 col-sm-6  border-solid border-green dropitems">
		 
<div class="answers w-100">
  

<ul class="options w-100 p-3">
<li class="title title-sorted">Sorted</li>
<li class="sink"><span class="target w-100" data-accept="1">Start the HTML page</span></li>
<li class="sink"><span class="target w-100" data-accept="2">Title and Stuff</span></li>
<li class="sink"><span class="target w-100" data-accept="3">Start the page content</span></li>
<li class="sink"><span class="target w-100" data-accept="4">Info to the user</span></li>
<li class="sink"><span class="target w-100" data-accept="5">Place to display the wins</span></li>
<li class="sink"><span class="target w-100" data-accept="6">Display something here</span></li>
<li class="sink"><span class="target w-100" data-accept="7">Display something else here</span></li>
<li><hr/></li>
<li class="sink"><span class="target w-100" data-accept="8">Begin Scripting</span></li>
<li class="sink"><span class="target w-100" data-accept="9">Declare the URL with the JSON data</span></li>
<li class="sink"><span class="target w-100" data-accept="10">Create an object to make a request</span></li>
<li class="sink"><span class="target w-100" data-accept="11">Use a GET invocation on the URL</span></li>
<li class="sink"><span class="target w-100" data-accept="12">Send the request!</span></li>
<li class="sink"><span class="target w-100" data-accept="13">Declare method to handle the response</span></li>
<li class="sink"><span class="target w-100" data-accept="14">Check for a good response</span></li>
<li class="sink"><span class="target w-100" data-accept="15">Log the JSON that we got</span></li>
<li class="sink"><span class="target w-100" data-accept="16">Convert JSON to score object</span></li>
<li class="sink"><span class="target w-100" data-accept="17">Update wins in the HTML</span></li>
<li class="sink"><span class="target w-100" data-accept="18">Update losses in the HTML</span></li>
<li class="sink"><span class="target w-100" data-accept="19">You know what to do next</span></li>


<li class="sink"><span class="target w-100" data-accept="20">End the if</span></li>
<li class="sink"><span class="target w-100" data-accept="21">End the method</span></li>
<li class="sink"><span class="target w-100" data-accept="22">End the script</span></li>
<li class="sink"><span class="target w-100" data-accept="23">You know what to do</span></li>
<li class="sink"><span class="target w-100" data-accept="24">Finish it off</span></li>



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