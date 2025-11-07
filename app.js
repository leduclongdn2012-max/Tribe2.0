/*
let following = false;
if (currentUser) {
const fdoc = doc(db, 'users', ownerId, 'followers', currentUser.uid);
const s = await getDoc(fdoc);
following = s.exists();
followBtn.textContent = following ? 'Đang theo dõi' : 'Theo dõi';
}


followBtn.onclick = async () => {
if (!currentUser) { alert('Đăng nhập để theo dõi'); return; }
const fdoc = doc(db, 'users', ownerId, 'followers', currentUser.uid);
if (!following) {
await setDoc(fdoc, {userId:currentUser.uid, createdAt: serverTimestamp()});
following = true;
} else {
await setDoc(fdoc, {removed:true});
following = false;
}
followBtn.textContent = following ? 'Đang theo dõi' : 'Theo dõi';
}
}


// --- Basic search ---
searchBtn.addEventListener('click', async ()=>{
const kw = (searchInput.value||'').toLowerCase();
if (!kw) { loadHome(); return; }
const q = query(collection(db,'videos'), orderBy('createdAt','desc'));
const snap = await getDocs(q);
const list = [];
snap.forEach(d=>{ const data=d.data(); if ((data.title||'').toLowerCase().includes(kw) || (data.tags||[]).join(' ').toLowerCase().includes(kw)) list.push({id:d.id,...data}) });
renderVideoGrid(list);
});


// init
loadHome();


// helpers
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }




/* ===== FILE: README.md (short) =====
Instructions:
1) Create Firebase project, enable Auth (Google), Storage, Firestore.
2) Paste config into app.js firebaseConfig.
3) Host files or open index.html locally (module imports require web server in some browsers).
4) Set Firestore rules for basic protection (see sample below).


Sample Firestore rules (development):
service cloud.firestore {
match /databases/{database}/documents {
match /users/{userId} {
allow read: if true;
allow write: if request.auth != null && request.auth.uid == userId;
match /followers/{f} { allow read: if true; allow write: if request.auth != null; }
}
match /videos/{videoId} {
allow read: if true;
allow create: if request.auth != null;
allow update: if request.auth != null; // improve rules in production
match /comments/{c} { allow read: if true; allow create: if request.auth != null; }
match /likes/{l} { allow read: if true; allow write: if request.auth != null; }
}
}
}


Security note: tighten rules before production (validate data shapes, prevent client-side increments misuse).
*/
