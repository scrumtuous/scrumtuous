---
layout: drag-and-drop
title:  "Installation of Apache Web Server Example"
blurb: "Need an example of how install the Apache Web Server on Windows? This quick tutorial will get Apache installed in a hurry!"
date:   2022-01-01 014:17:00 -0500
categories: aws exam
canonical: http://www.scrumtuous.com/aws/exam/2022/01/01/apache-web-server-installation-windows.html
keywords: Apache WebServer HTTP Server AWS
---
<h1 class="btn btn-primary btn-sm " style="background: linear-gradient(45deg, #6831e3, #f528cb);">Apache Web Server Installation on Windows</h1>
			
<div class="embed-responsive embed-responsive-16by9">
<iframe width="560" height="315" src="https://www.youtube.com/embed/tYPQFztqV4I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
</div>

<h2 class="btn btn-primary btn-sm " style="background: linear-gradient(45deg, #6831e3, #f528cb);">Installation of Apache on Windows</h2>

The installation of the Apache Web Server on Windows isn't straight forward.

You don't actually get the installation media from the Apache Foundation website. You have to get a pre-built Apache Web Server distribution from a third party like <a href="https://bitnami.com/stack/lamp">Bitnami (LAMP)</a> or from Apache Friends. 

In this example I actually download the web server from the Apache Lounge. I'd link to them from here, but I find every time I go there I get hit with lots of ads, so I'll spare you the pain.

<figure class="figure">
  <img src="https://www.wikihow.com/images/thumb/9/9a/Install-the-Apache-Web-Server-on-a-Windows-PC-Step-1.jpg/v4-460px-Install-the-Apache-Web-Server-on-a-Windows-PC-Step-1.jpg.webp" alt="Install Apache Web Server" class="img-fluid mx-auto d-block img-thumbnail rounded ">
  <figcaption class="figure-caption">How to download and install the Apache Web Server on Windows 10.</figcaption>
</figure>

<h3 class="btn btn-primary btn-sm " style="background: linear-gradient(45deg, #6831e3, #f528cb);">Windows Apache Install Errors</h3>

After you extract the Apache Web Server for Windows zip file, make sure you copy the Apache24 folder right to the root of C. If you put it anywhere else, you'll end up with Apache Web Server installation errors about a missing folders.

Good luck! The installation isn't that hard. Once you're done, run the httpd.exe file, put files into the htdocs folder and everything will be available to you at the localhost address on port 80.

Happy Apache!