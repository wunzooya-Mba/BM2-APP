const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors({origin:"*"}));
app.use(express.json({limit:"10mb"}));

// WORLDWIDE STORAGE
let posts = [{user:"Wunzooya Mba", zone:"tamale", text:"hello tamale! FBZone is live from ghana!"}];
let users = [];
let codes = {};

function genCode(){return Math.floor(100000+Math.random()*900000).toString();}

// Email setup - uses your Vercel ENV vars
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// AUTH REGISTER
app.post('/api/auth/register', async (req,res)=>{
  const {email, contact, name, age, country, sex} = req.body;
  if(!name ||!age ||!country ||!sex){return res.status(400).json({error:"Fill all fields"});}
  const key = email || contact;
  if(!key){return res.status(400).json({error:"Need email or contact"});}
  const code = genCode();
  codes[key] = {code, expires: Date.now()+10*60*1000, userData:{email,contact,name,age,country,sex}};
  console.log(`CODE for ${key}: ${code}`);

  // TRY SEND EMAIL if email provided
  if(email){
    try{
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'FBZone Verification Code',
        text: `Your FBZone verification code is: ${code}. It expires in 10 minutes.`,
        html: `<h2>Your FBZone Code: <b>${code}</b></h2><p>Expires in 10 minutes.</p>`
      });
      console.log(`Email sent to ${email}`);
      return res.json({success:true, message:"Code sent to email!", key:key});
    }catch(e){
      console.error("Email failed:", e.message);
      // fall through to still return code if email fails (for testing)
    }
  }
  res.json({success:true, message:"Code sent!", code:code, key:key});
});

// AUTH VERIFY
app.post('/api/auth/verify', (req,res)=>{
  const {key, code} = req.body;
  const record = codes[key];
  if(!record){return res.status(400).json({error:"No code, register again"});}
  if(Date.now() > record.expires){delete codes[key]; return res.status(400).json({error:"Expired"});}
  if(record.code!==code){return res.status(400).json({error:"Wrong code"});}
  let user = users.find((u)=>(u.email && u.email===record.userData.email) || (u.contact && u.contact===record.userData.contact));
  if(!user){
    user = {id: Date.now().toString(),...record.userData, verified:true, createdAt:new Date().toISOString()};
    users.push(user);
  }
  delete codes[key];
  res.json({success:true, user:user, token:user.id});
});

app.get('/api/auth/users', (req,res)=>{res.json(users);});
app.get('/api/posts', (req,res)=>{res.json(posts.reverse());});
app.get('/', (req,res)=>{res.json({message:"FBZone API live", posts:posts.length, users:users.length});});
app.post('/api/posts', (req,res)=>{
  const {user, zone, text, image} = req.body;
  const post = {id: Date.now().toString(), user, zone, text, image, createdAt: new Date().toISOString()};
  posts.push(post);
  res.json({success:true, post});
});

module.exports = app;
