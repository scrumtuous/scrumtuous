(function initializeExamPage() {
  "use strict";

  var AFFINITY_ENDPOINT =
    "https://api.certificationexams.guru/protected/affinity/";
  var AUTH_WAIT_TIMEOUT_MS = 5000;
  var REQUEST_TIMEOUT_MS = 5000;

  function loadExamApplication() {
    try {
      var script = document.createElement("script");
      script.src = "/static/js/main.211f2e1d.js";
      script.defer = true;
      script.addEventListener("error", function () {
        console.error("[exam] Unable to load the exam application.");
      });
      document.body.appendChild(script);
    } catch (error) {
      console.error("[exam] Error while adding the exam script:", error);
    }
  }

  function resolveWithTimeout(promise, timeoutMs) {
    return new Promise(function (resolve) {
      var settled = false;
      var timer = window.setTimeout(function () {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      }, timeoutMs);

      Promise.resolve(promise)
        .then(function (value) {
          if (!settled) {
            settled = true;
            window.clearTimeout(timer);
            resolve(value || null);
          }
        })
        .catch(function () {
          if (!settled) {
            settled = true;
            window.clearTimeout(timer);
            resolve(null);
          }
        });
    });
  }

  async function getAuthenticatedUser() {
    try {
      if (
        window.currentUser &&
        (window.currentUser.id_token || window.currentUser.access_token)
      ) {
        return window.currentUser;
      }

      if (window.authReady && typeof window.authReady.then === "function") {
        var readyUser = await resolveWithTimeout(
          window.authReady,
          AUTH_WAIT_TIMEOUT_MS
        );
        if (readyUser && (readyUser.id_token || readyUser.access_token)) {
          return readyUser;
        }
      }

      if (
        window.currentUser &&
        (window.currentUser.id_token || window.currentUser.access_token)
      ) {
        return window.currentUser;
      }
    } catch (error) {
      console.warn("[affinity] Unable to resolve the authenticated user:", error);
    }

    return null;
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () {
      controller.abort();
    }, timeoutMs);

    return fetch(
      url,
      Object.assign({}, options, { signal: controller.signal })
    ).finally(function () {
      window.clearTimeout(timeoutId);
    });
  }

  async function sendAffinity() {
    try {
      if (window.__examAffinityRequestSent === true) {
        return;
      }

      var root = document.getElementById("root");
      if (!root) {
        console.warn("[affinity] No #root exam element found; skipping.");
        return;
      }

      var examName = root.getAttribute("data-name");
      if (!examName) {
        console.warn("[affinity] Exam data-name is empty; skipping.");
        return;
      }

      var user = await getAuthenticatedUser();
      if (!user) {
        console.log("[affinity] No authenticated Cognito user found; skipping.");
        return;
      }

      var token = user.id_token || user.access_token;
      if (!token) {
        console.log("[affinity] No bearer token available; skipping.");
        return;
      }

      window.__examAffinityRequestSent = true;
      var response = await fetchWithTimeout(
        AFFINITY_ENDPOINT + encodeURIComponent(examName),
        {
          method: "POST",
          mode: "cors",
          cache: "no-store",
          credentials: "omit",
          keepalive: true,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: "{}"
        },
        REQUEST_TIMEOUT_MS
      );

      if (!response.ok) {
        console.warn(
          "[affinity] Request failed:",
          response.status,
          response.statusText,
          examName
        );
        window.__examAffinityRequestSent = false;
        return;
      }

      console.log("[affinity] Logged:", examName);
    } catch (error) {
      window.__examAffinityRequestSent = false;
      if (error && error.name === "AbortError") {
        console.warn("[affinity] Request timed out.");
        return;
      }
      console.warn("[affinity] Isolated request failure:", error);
    }
  }

  function scheduleAffinityTracking() {
    window.setTimeout(function () {
      Promise.resolve(sendAffinity()).catch(function (error) {
        console.warn("[affinity] Unexpected isolated failure:", error);
      });
    }, 0);
  }

  window.sendExamAffinity = function () {
    window.__examAffinityRequestSent = false;
    return Promise.resolve(sendAffinity()).catch(function (error) {
      console.warn("[affinity] Manual retry failed:", error);
    });
  };

  function initializeTypewriter() {
    var CHAR_DELAY_MS = 18;
    var BETWEEN_LINES_MS = 180;
    var animationToken = 0;

    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }

    async function typeText(element, text, token) {
      element.textContent = "";
      for (var index = 0; index < text.length; index += 1) {
        if (token !== animationToken) {
          return;
        }
        element.textContent += text.charAt(index);
        await sleep(CHAR_DELAY_MS);
      }
    }

    function getCurrentExamText() {
      var queryElement = document.getElementById("query");
      var optionElements = Array.prototype.slice
        .call(document.querySelectorAll("label[id^='labelOption']"))
        .filter(function (element) {
          return element && element.textContent && element.textContent.trim();
        });

      if (!queryElement || !queryElement.textContent.trim()) {
        return null;
      }

      return {
        query: { element: queryElement, text: queryElement.textContent },
        options: optionElements.map(function (element) {
          return { element: element, text: element.textContent };
        })
      };
    }

    async function runTypewriter(triggerButton) {
      var snapshot = getCurrentExamText();
      if (!snapshot) {
        return;
      }

      animationToken += 1;
      var localToken = animationToken;
      triggerButton.classList.add("is-running");
      triggerButton.setAttribute("aria-busy", "true");

      try {
        await typeText(snapshot.query.element, snapshot.query.text, localToken);
        for (
          var optionIndex = 0;
          optionIndex < snapshot.options.length;
          optionIndex += 1
        ) {
          if (localToken !== animationToken) {
            return;
          }
          await sleep(BETWEEN_LINES_MS);
          var option = snapshot.options[optionIndex];
          await typeText(option.element, option.text, localToken);
        }
      } finally {
        if (localToken === animationToken) {
          triggerButton.classList.remove("is-running");
          triggerButton.removeAttribute("aria-busy");
        }
      }
    }

    function ensureTriggerButton() {
      var section = document.getElementById("exam-overview");
      if (!section || document.getElementById("exam-typewriter-trigger")) {
        return false;
      }

      var triggerButton = document.createElement("button");
      triggerButton.id = "exam-typewriter-trigger";
      triggerButton.type = "button";
      triggerButton.setAttribute(
        "aria-label",
        "Replay the question and options with a typewriter effect"
      );
      triggerButton.innerHTML = '<span class="glyph">_</span>';
      triggerButton.addEventListener("click", function () {
        runTypewriter(triggerButton).catch(function (error) {
          console.warn("[exam] Typewriter effect failed:", error);
          triggerButton.classList.remove("is-running");
          triggerButton.removeAttribute("aria-busy");
        });
      });
      section.appendChild(triggerButton);
      return true;
    }

    if (!ensureTriggerButton()) {
      var observer = new MutationObserver(function () {
        if (ensureTriggerButton()) {
          observer.disconnect();
        }
      });
      observer.observe(document.getElementById("root"), {
        childList: true,
        subtree: true
      });
    }
  }

  window.addEventListener("load", function () {
    loadExamApplication();
    scheduleAffinityTracking();
  }, { once: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTypewriter, {
      once: true
    });
  } else {
    initializeTypewriter();
  }
})();