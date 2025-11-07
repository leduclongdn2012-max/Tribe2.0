const videos = [
  {
    title: "Hướng dẫn làm sinh tố xanh lá detox",
    channel: "Tribe Channel",
    views: "1.2M lượt xem",
    thumbnail: "https://images.unsplash.com/photo-1603052875672-fb0dcbf9d8db?w=800"
  },
  {
    title: "Bí quyết trồng cây trong nhà dễ sống 🌿",
    channel: "NatureVibe",
    views: "789K lượt xem",
    thumbnail: "https://images.unsplash.com/photo-1602872029931-f8cc88f3b849?w=800"
  },
  {
    title: "Top 5 hồ nước xanh nhất hành tinh 🌎",
    channel: "EarthTube",
    views: "2.3M lượt xem",
    thumbnail: "https://images.unsplash.com/photo-1520962918287-7448c2878f65?w=800"
  },
  {
    title: "Vườn mini tự tạo tại nhà — cực chill 💚",
    channel: "GreenMaker",
    views: "932K lượt xem",
    thumbnail: "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?w=800"
  }
];

const container = document.getElementById("video-container");

function showVideos(list) {
  container.innerHTML = "";
  list.forEach(v => {
    const vid = document.createElement("div");
    vid.classList.add("video");
    vid.innerHTML = `
      <img src="${v.thumbnail}" alt="video" class="thumbnail">
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="channel-name">${v.channel}</div>
        <div class="views">${v.views}</div>
      </div>
    `;
    container.appendChild(vid);
  });
}

showVideos(videos);

document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = videos.filter(v => v.title.toLowerCase().includes(keyword));
  showVideos(filtered);
});

document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = videos.filter(v => v.title.toLowerCase().includes(keyword));
  showVideos(filtered);
});
