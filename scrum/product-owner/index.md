---
layout: default
title: "Scrum Product Owner Exam Questions and Answers"
blurb: "Here are some tough Scrum Product OwnerQuiz Questions and Answers."
keywords: Scrum, PSPO, PSOP1, Scrum Product Owner Certification Exam Questions, Scrum Mock Exam
subfolder: product-owner
formal-exam-name: Product Owner
product-id: prod_Smt6NcuqQnfMjF
exam-name: scrum-product-owner
---
{% assign xp = site.data.exam_page %}
{% assign hero_title = xp.hero.title | replace: '[[EXAM_NAME]]', page.formal-exam-name %}

<div id="root">
  <div class="App">

    <div class="pt-lg-4 pb-lg-16 pt-8 pb-12 bg-primary" style="background: linear-gradient(45deg, #6831e3, #f528cb)">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12">
            <div style="text-align: left;">
              <h2 class="text-white display-4 fw-semi-bold mt-6">{{ hero_title }}</h2>
              <p class="text-white mb-3 lead">
                Just click the 'Start Exam' button below.<br/>
				Getting Scrum certified couldn't be easier!
                
              </p>
              <h3>{{ xp.hero.guarantee }}</h3>
              {% include graphics/success-stories-stars.html %}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pb-10">
      <div class="container">
        <div class="row">
          <!-- Left Column -->
          <div class="mt-n8 mb-4 mb-lg-0 col-lg-8 col-md-12 col-sm-12">
            <div class="card" style="background-color: #f0f0f0;">
              <div class="card-body p-0">
                <div class="tab-content">
                  <div class="tab-pane active pb-4 pt-3 px-4">
                    <div class="row">

                      {% for card in xp.cards %}
                      {% assign blurb = card.blurb | replace: '[[EXAM_SLUG]]', page.subfolder %}
                      <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 mb-2 d-flex align-items-stretch{% if card.id == 9 %} col-12{% endif %}">
                        <div class="card h-100 d-flex flex-column">
                          <div class="card-header">{{ card.header }}</div>

                          {% include {{ card.ribbon_include }} %}

                          <div class="card-body d-flex flex-column flex-grow-1">
                            <p class="card-text">{{ blurb }}</p>
                            <p class="text-center mt-auto">
                              <a
                                {% if card.id == 9 %}id="purchase-link"{% endif %}
                                href="/scrum/{{ page.subfolder }}/{{ card.path }}"
                                class="btn btn-outline-primary btn-sm">
                                {{ card.button }}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      {% endfor %}

                    </div> <!-- /.row -->
                  </div> <!-- /.tab-pane -->
                </div> <!-- /.tab-content -->
              </div> <!-- /.card-body -->
            </div> <!-- /.card -->
          </div> <!-- /.left column -->

          <!-- Right Column -->
		  
          <div class="mt-lg-n22 col-lg-4 col-md-12 col-sm-12">
			 {% include sidebars/mini-profile.html %}
             {% include sidebars/buy-me-a-coffee.html %}
			 {% include sidebars/mckenzie.html %} 
             {% include sidebars/scrumtuous.html %}
          </div>

        </div> <!-- /.row -->
      </div> <!-- /.container -->
    </div> <!-- /.pb-10 -->
</div> <!-- /.App -->
</div> <!-- /#root -->

<script>
window.addEventListener("DOMContentLoaded", function () {
  var DEBUG = true;
  function dbg() { if (DEBUG) console.log.apply(console, arguments); }
  function dwrn() { if (DEBUG) console.warn.apply(console, arguments); }

  dbg("DOMContentLoaded");

  const purchaseLink = document.getElementById("purchase-link");
  if (!purchaseLink) {
    console.warn("[purchase] link not found, exiting.");
    return;
  }

  // Use the link's current href as the destination for users who already own the exam
  // (capture it BEFORE we overwrite href with the fallback)
  var purchasedExam = purchaseLink.getAttribute("href") || purchaseLink.href;
  dbg("[purchase] captured purchasedExam href:", purchasedExam);

  const productId   = "{{ page.product-id }}";
  const defaultExam = "{{ page.exam-name }}";

  // Boolean-check Lambda (text/plain "true"/"false")
  const checkUrlBase    = "https://mgccqk5t2ricxpkexabnzufmca0dyohw.lambda-url.us-east-1.on.aws";
  // Purchase Lambda
  const purchaseBaseUrl = "https://i4hg3s7nqz2kjbzipsdysv5c2u0psiyw.lambda-url.us-east-1.on.aws";

  // Immediate safe fallback
  const fallbackUrl = `${purchaseBaseUrl}?productId=${encodeURIComponent(productId)}&exam=${encodeURIComponent(defaultExam)}`;
  purchaseLink.href = fallbackUrl;
  dbg("[purchase] set fallback:", fallbackUrl);

  let processing = false;
  let done = false;
  const startedAt = Date.now();

  const interval = setInterval(async () => {
    if (done || processing) return;

    const user = window.currentUser;
    if (!user || !user.profile) {
      // stop polling after 10s to avoid noise
      if (Date.now() - startedAt > 10000) {
        clearInterval(interval);
        dbg("[purchase] gave up waiting for profile after 10s.");
      } else {
        dbg("[purchase] waiting for profile...");
      }
      return;
    }

    // We have a profile — prevent further ticks immediately
    processing = true;
    clearInterval(interval);

    const email = user.profile.email || "";
    const encodedEmail = encodeURIComponent(email);
    const stripeCustomerId = user.profile["custom:stripeCustomerId"] || "";

    dbg("[purchase] profile ready; stripeCustomerId:", stripeCustomerId);

    // If no customer id, point to purchase without customer id
    if (!stripeCustomerId) {
      const buyUrl =
        `${purchaseBaseUrl}?productId=${encodeURIComponent(productId)}` +
        `&exam=${encodeURIComponent(defaultExam)}&email=${encodedEmail}`;
      purchaseLink.href = buyUrl;
      console.log("[purchase] no stripeCustomerId; using purchase link without customer id.", buyUrl);
      done = true;
      return;
    }

    // Check purchase status once
    const checkUrl =
      `${checkUrlBase}/?stripeCustomerId=${encodeURIComponent(stripeCustomerId)}` +
      `&productId=${encodeURIComponent(productId)}&exam=${encodeURIComponent(defaultExam)}`;

    dbg("[purchase] calling check:", checkUrl);

    try {
      const ctl = new AbortController();
      const t = setTimeout(function(){ ctl.abort(); }, 4000);

      const res = await fetch(checkUrl, {
        method: "GET",
        headers: { "Accept": "text/plain" },
        signal: ctl.signal,
        credentials: "omit"
      });

      clearTimeout(t);

      if (!res.ok) {
        dwrn("[purchase] check non-OK:", res.status, res.statusText);
        const buyUrl =
          `${purchaseBaseUrl}?productId=${encodeURIComponent(productId)}` +
          `&customerId=${encodeURIComponent(stripeCustomerId)}` +
          `&exam=${encodeURIComponent(defaultExam)}&email=${encodedEmail}`;
        purchaseLink.href = buyUrl;
        console.log("[purchase] linking to purchase (check non-OK).");
      } else {
        const text = (await res.text()).trim().toLowerCase();
        const purchased = text === "true";
        dbg("[purchase] check result:", text, "→", purchased);

        if (purchased) {
          purchaseLink.href = purchasedExam; // ← use the original href from the anchor
          console.log("[purchase] user already owns exam; linking to purchased content:", purchasedExam);
        } else {
          const buyUrl =
            `${purchaseBaseUrl}?productId=${encodeURIComponent(productId)}` +
            `&customerId=${encodeURIComponent(stripeCustomerId)}` +
            `&exam=${encodeURIComponent(defaultExam)}&email=${encodedEmail}`;
          purchaseLink.href = buyUrl;
          console.log("[purchase] not owned; linking to purchase.");
        }
      }
    } catch (err) {
      dwrn("[purchase] check failed:", err && err.message ? err.message : err);
      const buyUrl =
        `${purchaseBaseUrl}?productId=${encodeURIComponent(productId)}` +
        `&customerId=${encodeURIComponent(stripeCustomerId)}` +
        `&exam=${encodeURIComponent(defaultExam)}&email=${encodedEmail}`;
      purchaseLink.href = buyUrl;
      console.log("[purchase] linking to purchase (error path).");
    } finally {
      done = true;
    }
  }, 500);

  // Hard stop after 10s in case nothing ever becomes available
  setTimeout(function () {
    if (!done) {
      clearInterval(interval);
      dbg("[purchase] interval auto-stopped after 10s.");
    }
  }, 10000);
});
</script>
