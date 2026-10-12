const AUTH_URL = "http://localhost:3000/auth/login";
const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = form.querySelector("button[type=submit]");
const message = document.getElementById("message");
function showMessage(text, kind) {
  message.textContent = text;
  message.className = kind;
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitBtn.disabled) return;
  submitBtn.disabled = true;
  showMessage("Logging in...", "");
  let stage = "request";
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    });
    stage = "response body";
    if (!response.ok) {
      const body = await response.json();
      showMessage(`Login failed: ${body.message ?? response.status}`, "error");
      return;
    }
    const data = await response.json();
    if (typeof data.accessToken !== "string") {
      throw new Error("The response did not contain an accessToken string.");
    }
    showMessage(`Logged in. Token starts: ${data.accessToken.slice(0, 20)}...`, "success");
  } catch (error) {
    console.error(`Failure during ${stage}:`, error);
    showMessage(`Could not complete ${stage}: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
});