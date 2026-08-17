// ========== Avatar Logout Modal ==========
const avatarBtn = document.getElementById("avatar-btn");
const logoutModal = document.getElementById("logout-modal");
const confirmLogout = document.getElementById("confirm-logout");
const cancelLogout = document.getElementById("cancel-logout");

// 获取所有工具栏按钮
const toolbarButtons = document.querySelectorAll('.toolbar button');
let activeButton = null;

toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 移除所有按钮的 active 类
    toolbarButtons.forEach(btn => btn.classList.remove('active'));
    
    // 给当前点击的按钮添加 active 类
    button.classList.add('active');
    
    // 更新 activeButton 变量
    activeButton = button;
  });
});

avatarBtn.addEventListener("click", () => {
  logoutModal.classList.remove("hidden");
});

cancelLogout.addEventListener("click", () => {
  logoutModal.classList.add("hidden");
});

confirmLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.href = "./login.html";
});

// ========== Image Upload Preview ==========
const imageInput = document.getElementById("image-input");
const previewImage = document.getElementById("preview-image");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// ========== Save Draft / Publish ==========
document.querySelector(".draft-btn").addEventListener("click", () => {
  alert("✅ Draft saved successfully!");
});

document.querySelector(".publish-btn").addEventListener("click", () => {
  alert("🚀 Your post has been published!");
});
