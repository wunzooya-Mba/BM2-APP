const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin:"*"}));
app.use(express.json({limit:"10mb"}));

// WORLDWIDE STORAGE
let posts = [{user:"Wunzooya Mba", zone:"tamale", text:"hello tamale! FBZone is live from ghana to the world", time:new Date().toLocaleString(), fire:1, image:""}];
let users = [];
let codes = {};

function genCode(){return Math.floor(100000+Math.random()*900000).toString();}

// AUTH REGISTER
app.post('/api/auth/register', (req,res)=>{
  const {email, contact, name, age, country, sex} = req.body;
  if(!name ||!age ||!country ||!sex){return res.status(400).json({error:"Fill all * fields"})}
  if(!email &&!contact){return res.status(400).json({error:"Need email or contact"})}
  const key = email || contact;
  const code = genCode();
  codes[key] = {code, expires: Date.now()+10*60*1000, userData:{email,contact,name,age,country,sex}};
  console.log(`CODE for ${key}: ${code}`);
  res.json({success:true, message:"Code sent!", code:code, key:key});
});

// AUTH VERIFY
app.post('/api/auth/verify', (req,res)=>{
  const {key, code} = req.body;
  const record = codes[key];
  if(!record){return res.status(400).json({error:"No code, register again"})}
  if(Date.now() > record.expires){delete codes[key]; return res.status(400).json({error:"Expired"})}
  if(record.code!== code){return res.status(400).json({error:"Wrong code"})}
  let user = users.find(u=> (u.email && u.email===record.userData.email) || (u.contact && u.contact===record.userData.contact));
  if(!user){
    user = {id: Date.now().toString(),...record.userData, verified:true, createdAt:new Date().toISOString()};
    users.push(user);
  }
  delete codes[key];
  res.json({success:true, user:user, token:user.id});
});

app.get('/api/auth/users', (req,res)=>{res.json(users);});
app.get('/api/posts', (req,res)=>{res.json(posts.reverse());});
app.get('/', (req,res)=>{res.json({message:"FBZone API Live", posts:posts.length, users:users.length});});
app.post('/api/posts', (req,res)=>{
  const {user, zone, text, image} = req.body;
  const newPost = {user:user||"Anon", zone:zone||"global", text:text||"", image:image||"", time:new Date().toLocaleString(), fire:0};
  posts.push(newPost);
  if(posts.length>100) posts.shift();
  res.json({success:true, posts:posts.reverse()});
});
app.post('/api/posts/:id/fire', (req,res)=>{
  const id = parseInt(req.params.id);
  const all = posts.reverse();
  if(all[id]){all[id].fire=(all[id].fire||0)+1;}
  posts = all.reverse();
  res.json({success:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("FBZone Worldwide Live on "+PORT));
module.exports = app;
