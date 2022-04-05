---
layout: drag-and-drop
title:  "Build an nginx Docker container and push to DockerHub"
blurb: "Here's a quick nginx and Docker tutorial to show you how to build a Docker image with a Dockerfile and push it to nginx."
date:   2022-01-01 10:20:00 -0500
categories: aws exam
canonical: http://www.scrumtuous.com/aws/exam/2022/01/01/html-rock-paper-docker-drag-and-drop.html
keywords: Docker DockerHub Push nginx Rock Paper Scissors Drag-n-Drop
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
		<li class="section-li"><i class="lni lni-checkmark"></i>When completed, copy the Roshambo HTML and JavaScript code into a text editor.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Save your HTML file as roshambo.html in a folder on your desktop named rps.</li>
		<li class="section-li"><i class="lni lni-checkmark"></i>Open your roshambo.html file in Chrome and view your page in a web browser!</li>
<li class="section-li"><i class="lni lni-checkmark"></i>Create a file named Dockerfile <b>(no extension)</b> in the same rps folder as roshambo.html</li>
	<li class="section-li"><i class="lni lni-checkmark"></i>Run the Docker commands from that folder</li>	
		</ol>	

	</div>

	<div class="col-xs-12 col-sm-6 ">
		<figure>
		<img src="/assets/rock-paper-scissors-javascript.jpg" alt="JavaScript for AWS Exam" class="img-fluid mx-auto d-block img-thumbnail rounded" />
		<figcaption>Here's what the HTML, JavaScript and 'styled' Roshambo example will look like when finished.</figcaption>
		</figure>
	</div>


</div>




<h3>WARNING: The dragging and dropping function doesn't work well on mobile.</h3>
    <div class="row mt-3 mb-3">
	

<div class="col-xs-12 col-sm-6  dragitems">
		 
<div class="unsorted w-100">
	 
<ul class="options w-100 p-3">

<li class="title title-scrambled">Scrambled</li>
<li class="option" data-target="1"><span class="option-data"> &lt;!DOCTYPE html&gt;  </span></li>
<li class="option" data-target="9"><span class="option-data"> .feedback {color: red; margin: 50px;}  </span></li>
<li class="option" data-target="3"><span class="option-data"> &lt;head&gt;  </span></li>
<li class="option" data-target="4"><span class="option-data"> &lt;meta charset=&quot;utf-8&quot;&gt;  </span></li>
<li class="option" data-target="2"><span class="option-data"> &lt;html&gt;  </span></li>
<li class="option" data-target="6"><span class="option-data"> &lt;style&gt;  </span></li>
<li class="option" data-target="15"><span class="option-data"> &lt;a href=&quot;#&quot; onclick=&quot;playRoshambo(&#39;rock&#39;)&quot;&gt; rock &lt;/a&gt; &amp;nbsp;  </span></li>
<li class="option" data-target="17"><span class="option-data"> &lt;a href=&quot;#&quot; onclick=&quot;playRoshambo(&#39;scissors&#39;)&quot;&gt; scissors &lt;/a&gt; &amp;nbsp;  </span></li>
<li class="option" data-target="10"><span class="option-data"> .highlighted {border: 2px red solid}  </span></li>
<li class="option" data-target="12"><span class="option-data"> &lt;/head&gt;  </span></li>
<li class="option" data-target="8"><span class="option-data"> p { font-family: verdana; }  </span></li>
<li class="option" data-target="5"><span class="option-data"> &lt;title&gt;Rock Paper Roshambo&lt;/title&gt;  </span></li>
<li class="option" data-target="13"><span class="option-data"> &lt;body class=&quot;highlighted&quot;&gt;  </span></li>
<li class="option" data-target="14"><span class="option-data"> &lt;p&gt;Which one will it be?&lt;/p&gt;  </span></li>
<li class="option" data-target="11"><span class="option-data"> &lt;/style&gt;  </span></li>
<li class="option" data-target="16"><span class="option-data"> &lt;a href=&quot;#&quot; onclick=&quot;playRoshambo(&#39;paper&#39;)&quot;&gt; paper &lt;/a&gt; &amp;nbsp;  </span></li>
<li class="option" data-target="18"><span class="option-data"> &lt;div id=&quot;results&quot; class=&quot;feedback&quot;&gt;&lt;/div&gt;  </span></li>
<li class="option" data-target="7"><span class="option-data"> body { color:navy; margin: 25px;}  </span></li>


<li><hr/></li>


<li class="option" data-target="23"><span class="option-data"> } // end rock if  </span></li>
<li class="option" data-target="19"><span class="option-data"> &lt;script&gt;  </span></li>
<li class="option" data-target="26"><span class="option-data"> } // end paper if  </span></li>
<li class="option" data-target="34"><span class="option-data"> &lt;/html&gt;  </span></li>
<li class="option" data-target="22"><span class="option-data"> result = &quot;tie&quot;  </span></li>
<li class="option" data-target="31"><span class="option-data"> } // end method   </span></li>
<li class="option" data-target="29"><span class="option-data"> } // end scissors if  </span></li>
<li class="option" data-target="24"><span class="option-data"> if (clientGesture==&#39;paper&#39;) {  </span></li>
<li class="option" data-target="33"><span class="option-data"> &lt;/body&gt;  </span></li>
<li class="option" data-target="27"><span class="option-data"> if (clientGesture==&#39;scissors&#39;) {  </span></li>
<li class="option" data-target="30"><span class="option-data"> document.getElementById(&#39;results&#39;).innerHTML = result;  </span></li>
<li class="option" data-target="25"><span class="option-data"> result = &quot;win&quot;  </span></li>
<li class="option" data-target="32"><span class="option-data"> &lt;/script&gt;  </span></li>
<li class="option" data-target="21"><span class="option-data"> if (clientGesture==&#39;rock&#39;) {  </span></li>
<li class="option" data-target="20"><span class="option-data"> playRoshambo = function(clientGesture) {  </span></li>
<li class="option" data-target="28"><span class="option-data"> result = &quot;lose&quot;  </span></li>

<li><hr/></li>


<li class="option" data-target="46"><span class="option-data"> docker build -t nginxuous . </span></li>
<li class="option" data-target="50"><span class="option-data"> docker push scrumtuous/nginxrps:v1 </span></li>

<li class="option" data-target="49"><span class="option-data"> docker tag nginxuous scrumtuous/nginxrps:v1 </span></li>
<li class="option" data-target="42"><span class="option-data"> docker run --name engine1 -p 80:80 -d nginx</span></li>
<li class="option" data-target="45"><span class="option-data"> FROM nginx
<br/>COPY roshambo.html  /usr/share/nginx/html</span></li>
<li class="option" data-target="48"><span class="option-data"> docker run --name rps02 -p 99:80 -d nginxuous </span></li>
<li class="option" data-target="44"><span class="option-data"> http://localhost:88</span></li>
<li class="option" data-target="47"><span class="option-data"> docker run --name rps01 -p 66:80 -d nginxuous </span></li>
<li class="option" data-target="41"><span class="option-data"> docker login -u scrumtuous -p password  </span></li>
<li class="option" data-target="51"><span class="option-data"> docker stop engine1 </span></li>
<li class="option" data-target="43"><span class="option-data"> docker run --name engine2 -p 88:80 -d nginx</span></li>

</ul>
</div>		 
		 
		 </div><!-- end dragitems -->

<div class="col-xs-12 col-sm-6  border-solid border-green dropitems">
		 
<div class="answers w-100">
  

<ul class="options w-100 p-3">
<li class="title title-sorted">Sorted</li>
<li class="sink"><span class="target w-100" data-accept="1">Declare the document type</span></li>
<li class="sink"><span class="target w-100" data-accept="2">Start your html</span></li>
<li class="sink"><span class="target w-100" data-accept="3">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="4">Page encoding</span></li>
<li class="sink"><span class="target w-100" data-accept="5">Page title</span></li>
<li class="sink"><span class="target w-100" data-accept="6">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="7">Make all body text navy blue</span></li>
<li class="sink"><span class="target w-100" data-accept="8">Change paragraph font family</span></li>
<li class="sink"><span class="target w-100" data-accept="9">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="10">Highlight with a red border</span></li>
<li class="sink"><span class="target w-100" data-accept="11">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="12">End head</span></li>
<li class="sink"><span class="target w-100" data-accept="13">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="14">Prompt the user</span></li>
<li class="sink"><span class="target w-100" data-accept="15">rock link</span></li>
<li class="sink"><span class="target w-100" data-accept="16">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="17">anchor tag</span></li>
<li class="sink"><span class="target w-100" data-accept="18">Display results</span></li>

<li><hr/></li>
<li class="sink"><span class="target w-100" data-accept="19">start the script</span></li>
<li class="sink"><span class="target w-100" data-accept="20">declare the method</span></li>
<li class="sink"><span class="target w-100" data-accept="21">client picks rock</span></li>
<li class="sink"><span class="target w-100" data-accept="22">it's a tie</span></li>
<li class="sink"><span class="target w-100" data-accept="23">end rock if</span></li>
<li class="sink"><span class="target w-100" data-accept="24">client picks paper</span></li>
<li class="sink"><span class="target w-100" data-accept="25">You're a potato!</span></li>
<li class="sink"><span class="target w-100" data-accept="26">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="27">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="28">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="29">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="30">Dynamically update the HTML</span></li>
<li class="sink"><span class="target w-100" data-accept="31">Put something here</span></li>
<li class="sink"><span class="target w-100" data-accept="32">Close the script tag</span></li>
<li class="sink"><span class="target w-100" data-accept="33">Almost done!</span></li>
<li class="sink"><span class="target w-100" data-accept="34">HTML DONE!</span></li>

<li><hr/></li>

<li class="sink"><span class="target w-100" data-accept="41">Login to DockerHub</span></li>
<li class="sink"><span class="target w-100" data-accept="42">Run nginx on port Antropov</span></li>
<li class="sink"><span class="target w-100" data-accept="43">Run nginx on port Lindros</span></li>
<li class="sink"><span class="target w-100" data-accept="44">View nginx in the browser</span></li>
<li class="sink"><span class="target w-100" data-accept="45">Contents to go into Dockerfile</span></li>
<li class="sink"><span class="target w-100" data-accept="46">Build your own Docker image (dot!) </span></li>
<li class="sink"><span class="target w-100" data-accept="47">Run your Docker image like it was Mario Lemieux</span></li>
<li class="sink"><span class="target w-100" data-accept="48">Run your Docker image like it was Wayne Gretzky</span></li>
<li class="sink"><span class="target w-100" data-accept="49">Tag your image with your Docker username</span></li>
<li class="sink"><span class="target w-100" data-accept="50">Push your personal image to your DockerHub account</span></li>

<li class="sink"><span class="target w-100" data-accept="51">Stop a docker container</span></li>





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

<pre>
git clone https://github.com/scrumtuous/numberguesser.git
cd numberguesser
docker build -t tomcatuous .
docker run --name monolith -p 8085:8080 -d tomcatuous
http://localhost:8085/numberguesser/playthegame



version: '3.7'
services:
  ng:
    image: nginxuous
    ports:
      - 8082:8080
  tc:
    image: tomcatuous
    ports:
      - 82:80



</pre>
