---
layout: null
---

<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
	
	{% include head-common.html %} 
	
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta property="fb:app_id" content="287616246137792" />   
    <title>Scrumtuous Blog</title>
	
	{% if page.canonical %}
	<link rel="canonical" href="{{ page.canonical }}" />
	{% else %}
	<!-- This is the else for if canonical -->	   
	{% endif %}
	
	<!-- canonical attempt: {{ page.title }} -->
	{% if page.blurb %}
	<meta name="description" content="{{ page.blurb }}"/>   
	{% else %}
	<meta name="description" content="Scrumtuous blog articles on Agile, DevOps and Scrum."/>   
	{% endif %}

	{% if page.keywords %}
	<meta name="keywords" content="{{ page.keywords }}"/>	  
	{% else %}
	<meta name="keywords" content="AWS Certification Exam DevOps Scrum Agile Java DevSecOps Git Jenkins GitHub Scrumtuous Darcy DeClute"/>	   
	{% endif %}
	
    
    <link rel="shortcut icon" type="image/x-icon" href="/assets/favicon.ico">
    <!-- Place favicon.ico in the root directory -->

    <!-- Web Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap" rel="stylesheet">

    <!-- ========================= CSS here ========================= -->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/LineIcons.2.0.css">
    <link rel="stylesheet" href="/assets/css/animate.css">
    <link rel="stylesheet" href="/assets/css/tiny-slider.css">
    <link rel="stylesheet" href="/assets/css/glightbox.min.css">
    <link rel="stylesheet" href="/assets/css/main.css">
	
		   <style>
         html { font-size: 12pt; }	
         h1 { font-size: 1.50em; }
         h2 { font-size: 1.25em; }
         h3 { font-size: 1.1em; }
         h4 { font-size: 1.05em; }
         h5 { font-size: .83em; }
         h6 { font-size: .75em; }
         a, u {text-decoration: none; color:#0d47a1}  
         a:hover {
         background-color: #f9fbfd; color #4285F4;
         }
         .header, .footer {
         background: white;
         text-align: center;
         }
         .main {
         background: white;
         text-align: left;
         }
         .aside-1 {
         background: white;
         }
         .aside-2 {
         background: white;
         }
      </style>
	  
	    <link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>

  
	<!-- partial -->
	<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
	<script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
	<script src='https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'></script>


	<script  src="/assets/js/drag-and-drop-script.js"></script>
	<link rel="stylesheet" href="/assets/css/drag-and-drop-style.css">

	</head>

<body>

{% include navigation2.html %} 
	

    <!-- Start App Screenshort Area -->
    <section class="app-screenshorts section mt-3">
        <div class="container">
		
		
	  <div class="row">
                <div class="col-12">
                    <div class="section-title">
                        <span class="wow fadeInDown mt-2" data-wow-delay=".2s" style="visibility: visible; animation-delay: 0.2s;">Scrumtuous Blog</span>
                        <h2 class="wow fadeInUp" data-wow-delay=".4s" style="visibility: visible; animation-delay: 0.4s;">Thoughts on Agile, Scrum & DevOps <a href="http://www.scrumtuous.com/rss.xml"><img src="/assets/valid-rss-rogers.png" alt="Scrumtuous RSS Feed" title="RSS Feed Validated" /></a></h2>
                    </div>
                </div>
            </div>
            <div class="row">
			
			
					
			
{% for question in site.data.practitioner %}
{% if question.quid  == 0 %}		
<div style="border: 1px solid #DEDEDE;" class="main col col-12 col-sm-6 col-md-4 col-lg-3  mb-3 mt-3 d-flex align-items-stretch d-flex flex-column">

                
               <div  style="border: 1px dashed #6831e3;" class="card h-100 mb-1 mt-3">
                  <div class="card-header">
                     <a href="{{ question.quid }}">Exam Question #{{ question.quid }}</a>
                  </div>
                  <div class="card-body">
                     <p class="card-text">{{ question.query | truncate:100 }}</p>
                     <a href="{{ question.quid }}" class="btn btn-primary btn-sm " style="background: linear-gradient(45deg, #6831e3, #f528cb);">Check it out</a>
                  </div>
               </div> 
               



</div>
{% endif %}
{% endfor %}

            </div>
        </div>
    </section>
    <!-- End App Screenshort Area -->
	
{% include footer.html %} 

    <!-- ========================= JS here ========================= -->
    <script src="/assets/js/bootstrap.min.js"></script>
    <script src="/assets/js/count-up.min.js"></script>
    <script src="/assets/js/wow.min.js"></script>
    <script src="/assets/js/tiny-slider.js"></script>
    <script src="/assets/js/glightbox.min.js"></script>
    <script src="/assets/js/imagesloaded.min.js"></script>
    <script src="/assets/js/isotope.min.js"></script>
    <script src="/assets/js/main.js"></script>
   




</body></html>



















