// login.js

// ✅ Step 1: 检查 URL 参数中是否包含 token（Google 登录成功后返回）
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const email = params.get("email");

if (token) {
  console.log("✅ 登录成功，token =", token);

  // 保存 token 与 email 到 localStorage
  localStorage.setItem("token", token);
  if (email) localStorage.setItem("email", email);

  // ✅ 跳转到 blog.html
  window.location.href = "./blog.html";
}

// ✅ Step 2: 点击 Google 登录按钮时调用
function handleGoogleLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");

  // ✅ 跳转到后端 Google 登录接口
  window.location.href = "https://1135sb5om7016.vicp.fun/oauth2/authorization/google";
}
