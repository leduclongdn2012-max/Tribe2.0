const uploadBtn = document.getElementById("uploadBtn");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");
const confirmUpload = document.getElementById("confirmUpload");
const videoFeed = document.getElementById("videoFeed");

uploadBtn.onclick = () => uploadModal.classList.remove("hidden");
closeModal.onclick = () => uploadModal.classList.add("hidden");

confirmUpload.onclick = () => {
  const file = document.getElementById("videoFile").files[0];
  const title = document.getElementById("videoTitle").value;
  if (!file || !title) {
    alert("Vui lòng chọn video và nhập tiêu đề!");
    return;
  }
  const url = URL.createObjectURL(file);
  const videoCard = document.createElement("div");
  videoCard.className = "video-card";
  videoCard.innerHTML = `
    <video class="video-thumb" src="${url}" controls></video>
    <div class="video-info">
      <h4>${title}</h4>
      <p>0 lượt xem</p>
    </div>
  `;
  videoFeed.prepend(videoCard);
  uploadModal.classList.add("hidden");
};
