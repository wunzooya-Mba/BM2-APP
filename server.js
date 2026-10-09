<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FBZone Worldwide</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial}
body{background:#0f0f0f;color:white;min-height:100vh}
.top{padding:10px;text-align:center;background:#000;border-bottom:2px solid #ffcc00;position:sticky;top:0;z-index:10}
.top h1{color:#ffcc00;letter-spacing:2px;font-size:28px}
.top span{color:#888;font-size:12px}
.card{max-width:480px;margin:20px auto;background:#1a1a1a;border-radius:14px;padding:16px;border:1px solid #333}
input,select,textarea{width:100%;padding:14px;margin:8px 0;background:#222;border:1px solid #444;color:white;border-radius:8px;font-size:16px}
button{width:100%;padding:14px;background:#ffcc00;color:black;border:none;border-radius:8px;font-size:17px;cursor:pointer;margin-top:8px;font-weight:bold}
button:active{transform:scale(0.97)}
.post{background:#222;padding:12px;border-radius:10px;margin:10px 0;border-left:4px solid #ffcc00}
.post b{color:#ffcc00}
.meta{font-size:11px;color:#888;margin-top:6px}
.fire{background:#333;color:#ffcc00;padding:4px 10px;border-radius:20px;border:none;width:auto;font-size:14px;margin-top:8px;cursor:pointer}
#status{text-align:center;padding:8px;color:#0f0;font-size:12px}
</style>
</head>
<body>
<div class="top">
<h1>FBZONE</h1>
<span>WORLDWIDE 🌍 - Tamale to the World</span>
</div>

<div class="card">
<div id="status">Connecting to worldwide...</div>
<input id="user" placeholder="Your name (e.g. Wunizooya)">
<select id="zone">
<option value="tamale">Tamale Zone</option>
<option value="accra">Accra Zone</option>
<option value="kumasi">Kumasi Zone</option>
<option value="global">Global Zone</option>
</select>
<textarea id="text" placeholder="What's happening in your zone?"></textarea>
<button onclick="postNow()">POST TO WORLDWIDE 🌍</button>
</div>

<div class="card" id="feed"></div>

<script>
const API = "https://bm-2-app.vercel.app/api/posts";

async function loadPosts(){
  document.getElementById("status").innerText = "🌍 Loading worldwide posts...";
  try{
    const res = await fetch(API);
    const posts = await res.json();
    document.getElementById("status").innerText = `✅ Worldwide Live - ${posts.length} posts`;
    render(posts);
  }catch(e){
    document.getElementById("status").innerText = "❌ Backend offline, check: " + API;
  }
}

function render(posts){
  const feed = document.getElementById("feed");
  feed.innerHTML = posts.map((p,i)=>`
    <div class="post">
      <b>${p.user}</b> <small style="color:#888">from ${p.zone}</small><br>
      ${p.text}
      <div class="meta">${p.time} - 🔥 ${p.fire||0} fires</div>
      <button class="fire" onclick="addFire(${i})">🔥 Fire (${p.fire||0})</button>
    </div>
  `).join("") || "<p style='text-align:center;color:#888'>No posts yet. Be first!</p>";
}

async function postNow(){
  const user = document.getElementById("user").value || "Anonymous";
  const zone = document.getElementById("zone").value;
  const text = document.getElementById("text").value;
  if(!text.trim()){alert("Write something!");return}
  
  document.getElementById("status").innerText = "Posting worldwide...";
  try{
    const res = await fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({user,zone,text})
    });
    const data = await res.json();
    document.getElementById("text").value = "";
    document.getElementById("status").innerText = "✅ Posted worldwide!";
    render(data.posts);
  }catch(e){
    alert("Failed to post. Check backend: "+API);
  }
}

async function addFire(id){
  try{
    await fetch(`${API}/${id}/fire`,{method:"POST"});
    loadPosts();
  }catch(e){}
}

loadPosts();
</script>
</body>
</html>
