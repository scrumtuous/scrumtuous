---
layout: gcp-architect-exam-question
title:  "Your company plans to migrate a multipetabyte data set to th GCP Exam "
blurb: "Google Cloud Architect Exam Question"
date:   2023-02-12 10:21:00 -0500
categories: google cloud architect exam
keywords: Google, Cloud, Architect, Exam
correct: A
---

<div class=" updated-query query">What type of storage should be implemented to store a multi-petabyte data set, with the goal of optimizing ease of analysis while ensuring 24/7 availability?
</div>
<div class=" original-query query">
  <p>
    Your company plans to migrate a multi-petabyte data set to the cloud.
  </p>
  <p>
    The data set must be available 24hrs a day.
  </p>
  <p>
    Your business analysts have experience only with using a SQL interface.
  </p>
  <p>
    How should you store the data to optimize it for ease of analysis?
  </p>
</div>
<input class="correctAnswer" type="checkbox"/><label data-question-correct="true" data-question-part="option0">A. Load data into Google BigQuery</label><br/>
<input type="checkbox"/><label data-question-part="option1">B. Insert data into Google Cloud SQL</label><br/>
<input type="checkbox"/><label data-question-part="option2">C. Put flat files into Google Cloud Storage</label><br/>
<input type="checkbox"/><label data-question-part="option3">D. Stream data into Google Cloud Datastore.</label><br/>
<div class="fullanswer">Given the requirements of the data set, a reliable and highly available data storage solution would be to store the data using Google Cloud Storage buckets. Google Cloud Storage offers very high availability and durability, enabling the data to be always available. Additionally, Google Cloud Storage offers a SQL interface that is familiar to most business analysts, making the data collection and analysis process highly optimized for ease of analysis.</div><div class="sourcelink"><a href="https://www.exam-answer.com/google/pca/question2">link</a></div>
