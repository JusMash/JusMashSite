export function initAuth() {
  const authModal = document.getElementById("authModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");
  const closeModal = document.getElementById("closeAuthModal");

  const loginBtns = document.querySelectorAll("#loginBtn, #heroLoginBtn");
  const signupBtns = document.querySelectorAll("#signupBtn, #heroSignupBtn");

  // Open login modal
  loginBtns.forEach(btn => btn.addEventListener("click", () => {
    authModal.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  }));

  // Open signup modal
  signupBtns.forEach(btn => btn.addEventListener("click", () => {
    authModal.classList.remove("hidden");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }));

  // Switch forms
  switchToSignup.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  });
  switchToLogin.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  // Close modal
  closeModal.addEventListener("click", () => authModal.classList.add("hidden"));
  window.addEventListener("click", e => {
    if (e.target === authModal) authModal.classList.add("hidden");
  });

  // Handle form submissions (store in localStorage)
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password); // For demo only
    alert("Signup successful!");
    authModal.classList.add("hidden");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
      alert("Login successful!");
      authModal.classList.add("hidden");
    } else {
      alert("Incorrect email or password.");
    }
  });
}
