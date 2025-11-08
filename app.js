// ---------------------------
// Đăng nhập / Đăng ký
// ---------------------------
const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const signupToggle = document.getElementById("signupToggle");
const logoutBtn = document.getElementById("logoutBtn");

let isSignup = false;

signupToggle.onclick = () => {
  isSignup = !isSignup;
  document.getElementById("signupHint").innerHTML = isSignup
    ? 'Đã có tài khoản? <span id="signupToggle">Đăng nhập</span>'
    : 'Chưa có tài khoản? <span id="signupToggle">Đăng ký</span>';
  signupToggle.onclick = signupToggle.onclick; // refresh event
};

loginBtn.onclick = () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) return alert("Nhập đầy đủ thông tin!");

  const users = JSON.parse(localStorage.getItem("tribe_users") || "{}");

  if (isSignup) {
    if (users[username]) return alert("Tên này đã tồn tại!");
    users[username] = { password, avatar: "https://i.imgur.com/0y0y0y0.png" };
    localStorage.setItem("tribe_users", JSON.stringify(users));
    alert("Đăng ký thành công! Hãy đăng nhập.");
    isSignup = false;
  } else {
    if (!users[username] || users[username].password !== password) return alert("Sai tài khoản hoặc mật khẩu!");
    localStorage.setItem("tribe_currentUser", username);
    startApp(username);
  }
};

function startApp(username) {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  document.getElementById("userAvatar").src = "https://i.imgur.com/0y0y0y0.png";
  loadPage("home");
}

logoutBtn.onclick = () => {
  localStorage.removeItem("tribe_currentUser");
  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
};

// Tự động đăng nhập nếu có tài khoản trước đó
const currentUser = localStorage.getItem("tribe_currentUser");
if (currentUser) startApp(currentUser);

// ---------------------------
// Hệ thống trang (SPA)
// ---------------------------
const mainContent = document.getElementById("mainContent");
const sidebarLinks = document.querySelectorAll(".sidebar a");

const pages = {
  home: `<h2>🏠 Trang chủ</h2><div id="videoFeed" class="video-grid"></div>`,
  following: `<h2>📺 Kênh theo dõi</h2><p>Các kênh bạn theo dõi sẽ hiển thị ở đây.</p>`,
  trend: `<h2>🔥 Xu hướng</h2><p>Video hot nhất cộng đồng TribeTube.</p>`,
  mychannel: `<h2>👤 Kênh của tôi</h2><div id="myVideos" class="video-grid"></div>`,
};

sidebarLinks.forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    sidebarLinks.forEach(a => a.classList.remove("active"));
    link.classList.add("active");
    loadPage(link.dataset.page);
  };
});

function loadPage(page) {
  mainContent.innerHTML = pages[page];
  if (page === "home") showUploadedVideos();
  if (page === "mychannel") showMyVideos();
}

// ---------------------------
// Upload video
// ---------------------------
const uploadBtn = document.getElementById("uploadBtn");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");
const confirmUpload = document.getElementById("confirmUpload");

let uploadedVideos = JSON.parse(localStorage.getItem("tribe_videos") || "[]");

uploadBtn.onclick = () => uploadModal.classList.remove("hidden");
closeModal.onclick = () => uploadModal.classList.add("hidden");

confirmUpload.onclick = () => {
  const file = document.getElementById("videoFile").files[0];
  const title = document.getElementById("videoTitle").value;
  const user = localStorage.getItem("tribe_currentUser");

  if (!file || !title) return alert("Chưa chọn video hoặc nhập tiêu đề!");
  const url = URL.createObjectURL(file);
  uploadedVideos.unshift({ title, url, user, views: 0, date: Date.now() });
  localStorage.setItem("tribe_videos", JSON.stringify(uploadedVideos));
  uploadModal.classList.add("hidden");
  loadPage("home");
};

function showUploadedVideos() {
  const feed = document.getElementById("videoFeed");
  if (!feed) return;
  feed.innerHTML = uploadedVideos.map(v => `
    <div class="video-card">
      <video class="video-thumb" src="${v.url}" controls></video>
      <div class="video-info">
        <h4>${v.title}</h4>
        <p>${v.user} • ${v.views} lượt xem</p>
      </div>
    </div>
  `).join("");
}

function showMyVideos() {
  const user = localStorage.getItem("tribe_currentUser");
  const my = uploadedVideos.filter(v => v.user === user);
  const container = document.getElementById("myVideos");
  if (!container) return;
  container.innerHTML = my.length
    ? my.map(v => `
      <div class="video-card">
        <video class="video-thumb" src="${v.url}" controls></video>
        <div class="video-info">
          <h4>${v.title}</h4>
          <p>${v.views} lượt xem</p>
        </div>
      </div>
    `).join("")
    : "<p>Bạn chưa tải lên video nào.</p>";
}
