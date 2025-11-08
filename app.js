// Bọc tất cả trong DOMContentLoaded để chắc chắn phần tử đã có
window.addEventListener('DOMContentLoaded', () => {
  // ---------------------------
  // DOM
  // ---------------------------
  const loginScreen = document.getElementById("loginScreen");
  const app = document.getElementById("app");
  const loginBtn = document.getElementById("loginBtn");
  const signupToggle = document.getElementById("signupToggle");
  const logoutBtn = document.getElementById("logoutBtn");
  const mainContent = document.getElementById("mainContent");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadModal = document.getElementById("uploadModal");
  const closeModal = document.getElementById("closeModal");
  const confirmUpload = document.getElementById("confirmUpload");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const userAvatar = document.getElementById("userAvatar");

  // ---------------------------
  // Data từ localStorage
  // ---------------------------
  let uploadedVideos = JSON.parse(localStorage.getItem("tribe_videos") || "[]");
  let users = JSON.parse(localStorage.getItem("tribe_users") || "{}");

  // ---------------------------
  // Đăng ký / Đăng nhập
  // ---------------------------
  let isSignup = false;

  function updateSignupHint() {
    const hint = document.getElementById('signupHint');
    hint.innerHTML = isSignup
      ? 'Đã có tài khoản? <span id="signupToggle" class="link-like">Đăng nhập</span>'
      : 'Chưa có tài khoản? <span id="signupToggle" class="link-like">Đăng ký</span>';
    // rebind event
    document.getElementById('signupToggle').addEventListener('click', () => {
      isSignup = !isSignup; updateSignupHint();
    });
  }
  updateSignupHint();

  loginBtn.addEventListener('click', () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Nhập đầy đủ thông tin!");

    // reload users from storage in case có thay đổi
    users = JSON.parse(localStorage.getItem("tribe_users") || "{}");

    if (isSignup) {
      if (users[username]) return alert("Tên này đã tồn tại!");
      // nếu người dùng không cung cấp avatar, dùng avatar mặc định
      users[username] = { password, avatar: "https://i.imgur.com/4Z1Z9YB.png" };
      localStorage.setItem("tribe_users", JSON.stringify(users));
      // tự động đăng nhập sau khi đăng ký
      localStorage.setItem("tribe_currentUser", username);
      startApp(username);
      alert("Đăng ký & đăng nhập thành công!");
    } else {
      if (!users[username] || users[username].password !== password) return alert("Sai tài khoản hoặc mật khẩu!");
      localStorage.setItem("tribe_currentUser", username);
      startApp(username);
    }
  });

  function startApp(username) {
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
    // set avatar từ dữ liệu user (nếu có), fallback sang default
    users = JSON.parse(localStorage.getItem("tribe_users") || "{}");
    const avatar = (users[username] && users[username].avatar) || "https://i.imgur.com/4Z1Z9YB.png";
    userAvatar.src = avatar;

    // render trang chủ
    loadPage('home');
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("tribe_currentUser");
    app.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });

  // Tự động đăng nhập nếu có
  const currentUser = localStorage.getItem("tribe_currentUser");
  if (currentUser) startApp(currentUser);

  // ---------------------------
  // SPA: pages
  // ---------------------------
  const pages = {
    home: `<h2>🏠 Trang chủ</h2><div id="videoFeed" class="video-grid"></div>`,
    following: `<h2>📺 Kênh theo dõi</h2><p>Các kênh bạn theo dõi sẽ hiển thị ở đây.</p>`,
    trend: `<h2>🔥 Xu hướng</h2><p>Video hot nhất cộng đồng TribeTube.</p>`,
    mychannel: `<h2>👤 Kênh của tôi</h2><div id="myVideos" class="video-grid"></div>`,
  };

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      loadPage(link.dataset.page);
    });
  });

  function loadPage(page) {
    mainContent.innerHTML = pages[page];
    // reload videos từ storage để đồng bộ
    uploadedVideos = JSON.parse(localStorage.getItem("tribe_videos") || "[]");
    if (page === "home") showUploadedVideos();
    if (page === "mychannel") showMyVideos();
  }

  // ---------------------------
  // Upload
  // ---------------------------
  uploadBtn.addEventListener('click', () => uploadModal.classList.remove('hidden'));
  closeModal.addEventListener('click', () => uploadModal.classList.add('hidden'));

  // đóng modal khi click bên ngoài nội dung
  uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) uploadModal.classList.add('hidden');
  });

  confirmUpload.addEventListener('click', () => {
    const file = document.getElementById("videoFile").files[0];
    const title = document.getElementById("videoTitle").value.trim();
    const desc = document.getElementById("videoDesc").value.trim();
    const user = localStorage.getItem("tribe_currentUser");

    if (!file || !title) return alert("Chưa chọn video hoặc nhập tiêu đề!");

    const url = URL.createObjectURL(file);
    const newVideo = { id: Date.now(), title, desc, url, user, views: 0, date: Date.now() };
    uploadedVideos.unshift(newVideo);
    localStorage.setItem("tribe_videos", JSON.stringify(uploadedVideos));
    uploadModal.classList.add('hidden');
    // reset input
    document.getElementById("videoFile").value = null;
    document.getElementById("videoTitle").value = "";
    document.getElementById("videoDesc").value = "";
    loadPage('home');
  });

  // ---------------------------
  // Hiển thị video
  // ---------------------------
  function showUploadedVideos(filter = '') {
    const feed = document.getElementById('videoFeed');
    if (!feed) return;
    const list = uploadedVideos.filter(v => v.title.toLowerCase().includes(filter.toLowerCase()));
    feed.innerHTML = list.map(v => `
      <div class="video-card">
        <video class="video-thumb" src="${v.url}" controls></video>
        <div class="video-info">
          <h4>${escapeHtml(v.title)}</h4>
          <p>${escapeHtml(v.user)} • ${v.views} lượt xem</p>
        </div>
      </div>
    `).join('');
  }

  function showMyVideos() {
    const user = localStorage.getItem("tribe_currentUser");
    const my = uploadedVideos.filter(v => v.user === user);
    const container = document.getElementById('myVideos');
    if (!container) return;
    container.innerHTML = my.length
      ? my.map(v => `
        <div class="video-card">
          <video class="video-thumb" src="${v.url}" controls></video>
          <div class="video-info">
            <h4>${escapeHtml(v.title)}</h4>
            <p>${v.views} lượt xem</p>
            <button class="delete-video" data-id="${v.id}">Xóa</button>
          </div>
        </div>
      `).join('')
      : "<p>Bạn chưa tải lên video nào.</p>";

    // gắn sự kiện xóa
    container.querySelectorAll('.delete-video').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        if (!confirm('Bạn có chắc muốn xóa video này?')) return;
        uploadedVideos = uploadedVideos.filter(x => x.id !== id);
        localStorage.setItem('tribe_videos', JSON.stringify(uploadedVideos));
        loadPage('mychannel');
      });
    });
  }

  // ---------------------------
  // Search (tính năng mới)
  // ---------------------------
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    // nếu đang ở trang home thì lọc, còn không thì chuyển sang home
    const active = document.querySelector('.sidebar a.active');
    if (!active || active.dataset.page !== 'home') {
      document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
      document.querySelector('.sidebar a[data-page="home"]')
