// ✅ Step 1: 获取登录信息
const storedToken = localStorage.getItem("token");
const storedEmail = localStorage.getItem("email");

// ✅ Step 2: 检查是否登录
if (!storedToken) {
  alert("Please login first!");
  window.location.href = "/html/login.html";
} else {
  console.log("✅ 当前登录邮箱:", storedEmail);
  const emailElement = document.getElementById("user-email");
  if (emailElement) {
    emailElement.textContent = storedEmail || "Unknown user";
  }
}

// ✅ Step 3: 登出按钮绑定（确保按钮存在）
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("logout-modal");
  const confirmBtn = document.getElementById("confirm-logout");
  const cancelBtn = document.getElementById("cancel-logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      modal.classList.remove("hidden"); // 打开弹窗
    });
  }

  // ✅ 确认登出
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      modal.classList.add("hidden");
      alert("You have logged out.");
      window.location.href = "../html/login.html";
    });
  }

  // ❌ 取消登出
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
});


