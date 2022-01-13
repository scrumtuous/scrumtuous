---
layout: blog
title:  "Scrumtuous Blog on Agile, Scrum & DevOps"
blurb: "Here are all of our tasty blog posts."
date:   2022-01-01 01:11:00 -0500
categories: 
canonical: http://www.scrumtuous.com/blog.html
keywords: Scrumtuous Blog Agile DevOps AWS Certification Scrum
---
abc
{% for post in site.posts %}			
<div style="border: 1px solid #DEDEDE;" class=" col-12 col-sm-12  col-md-6 col-lg-4 mb-1 mt-1">

               
               <div  style="border: 1px dashed #6831e3;" class="card mb-1 mt-2">
                  <div class="card-header">
                     <a href="{{ post.url }}">{{ post.title }}</a>
                  </div>
                  <div class="card-body">
                     <p class="card-text">{{ post.blurb }}</p>
                     <a href="{{ post.url }}" class="btn btn-primary btn-sm" style="background: linear-gradient(45deg, #6831e3, #f528cb);">Check it out</a>
                  </div>
               </div>
               



</div>
{% endfor %}
