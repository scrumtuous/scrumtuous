---
layout: default
title: "Logout Page, and Log Back in Again"
blurb: "Log out and then log back in if you like"
keywords: AWS Practitioner Study Guide, AWS Certification, Amazon Practitioner, AWS Exam
---


You've been logged out. Now log back in again and take some certification exam tests!
<script>
  const settings = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_2Vm1F3RdZ",
    client_id: "s6qs08b48fg6u10gg5hlurfvc",
    redirect_uri: "https://certificationexams.guru/index.html",
    response_type: "code",
    scope: "email openid phone profile",
    post_logout_redirect_uri: "https://certificationexams.guru/index.html"
  };

  const userManager = new Oidc.UserManager(settings);

  // Immediately sign the user out
  userManager.signoutRedirect().catch(err => {
    console.error("Logout failed:", err);
  });
</script>
