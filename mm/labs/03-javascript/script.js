const form = document.getElementById("login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const message = document.getElementById("message");
function markInvalid(input, invalid) {
  input.classList.toggle("invalid", invalid);
  input.setAttribute("aria-invalid", String(invalid));
}
function showMessage(text, kind) {
  message.textContent = text;
  message.className = kind;
}
form.addEventListener("submit", (event) => {
  event.preventDefault(); // every path stays on this page
  const username = usernameInput.value;
  const password = passwordInput.value;
  const usernameOk = username.length >= 3;
  const passwordOk = password.length >= 8;
  markInvalid(usernameInput, !usernameOk);
  markInvalid(passwordInput, !passwordOk);
  if (!usernameOk || !passwordOk) {
    showMessage("Username needs 3+ characters, password needs 8+.", "error");
    return;
  }
  showMessage(`Welcome, ${username}. (No real request sent yet.)`, "success");
  form.reset();
});
usernameInput.addEventListener("input", () => {
  if (usernameInput.value.length >= 3) markInvalid(usernameInput, false);
});