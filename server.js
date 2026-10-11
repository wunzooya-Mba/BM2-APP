<<<<<<< HEAD
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
=======
𝑐𝑜𝑛𝑠𝑡 𝑒𝑥𝑝𝑟𝑒𝑠𝑠 = 𝑟𝑒𝑞𝑢𝑖𝑟𝑒('𝑒𝑥𝑝𝑟𝑒𝑠𝑠');
𝑟𝑒𝑞𝑢𝑖𝑟𝑒('𝑑𝑜𝑡𝑒𝑛𝑣').𝑐𝑜𝑛𝑓𝑖𝑔();
𝑐𝑜𝑛𝑠𝑡 𝑐𝑜𝑟𝑠 = 𝑟𝑒𝑞𝑢𝑖𝑟𝑒('𝑐𝑜𝑟𝑠');
𝑐𝑜𝑛𝑠𝑡 𝑛𝑜𝑑𝑒𝑚𝑎𝑖𝑙𝑒𝑟 = 𝑟𝑒𝑞𝑢𝑖𝑟𝑒('𝑛𝑜𝑑𝑒𝑚𝑎𝑖𝑙𝑒𝑟');

𝑐𝑜𝑛𝑠𝑡 𝑎𝑝𝑝 = 𝑒𝑥𝑝𝑟𝑒𝑠𝑠();
𝑎𝑝𝑝.𝑢𝑠𝑒(𝑐𝑜𝑟𝑠());
𝑎𝑝𝑝.𝑢𝑠𝑒(𝑒𝑥𝑝𝑟𝑒𝑠𝑠.𝑗𝑠𝑜𝑛());

// 𝑆𝑡𝑜𝑟𝑒 𝑐𝑜𝑑𝑒𝑠 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦
𝑐𝑜𝑛𝑠𝑡 𝑐𝑜𝑑𝑒𝑠 = {};

𝑙𝑒𝑡 𝑡𝑟𝑎𝑛𝑠𝑝𝑜𝑟𝑡𝑒𝑟;
𝑖𝑓 (𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝐸𝑀𝐴𝐼𝐿_𝑈𝑆𝐸𝑅 && 𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝐸𝑀𝐴𝐼𝐿_𝑃𝐴𝑆𝑆) {
  𝑡𝑟𝑎𝑛𝑠𝑝𝑜𝑟𝑡𝑒𝑟 = 𝑛𝑜𝑑𝑒𝑚𝑎𝑖𝑙𝑒𝑟.𝑐𝑟𝑒𝑎𝑡𝑒𝑇𝑟𝑎𝑛𝑠𝑝𝑜𝑟𝑡({
    𝑠𝑒𝑟𝑣𝑖𝑐𝑒: '𝑔𝑚𝑎𝑖𝑙',
    𝑎𝑢𝑡ℎ: {
      𝑢𝑠𝑒𝑟: 𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝐸𝑀𝐴𝐼𝐿_𝑈𝑆𝐸𝑅,
      𝑝𝑎𝑠𝑠: 𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝐸𝑀𝐴𝐼𝐿_𝑃𝐴𝑆𝑆
    }
  });
}

// 𝑅𝑜𝑢𝑡𝑒𝑠
𝑎𝑝𝑝.𝑔𝑒𝑡('/', (𝑟𝑒𝑞, 𝑟𝑒𝑠) => {
  𝑟𝑒𝑠.𝑠𝑒𝑛𝑑('𝐹𝐵𝑍𝑜𝑛𝑒 𝑤𝑜𝑟𝑙𝑑𝑤𝑖𝑑𝑒 𝐴𝑃𝐼 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 🚀 - ' + 𝑛𝑒𝑤 𝐷𝑎𝑡𝑒().𝑡𝑜𝐼𝑆𝑂𝑆𝑡𝑟𝑖𝑛𝑔());
});

𝑎𝑝𝑝.𝑔𝑒𝑡('/𝑎𝑝𝑖/𝑡𝑒𝑠𝑡', (𝑟𝑒𝑞, 𝑟𝑒𝑠) => {
  𝑟𝑒𝑠.𝑗𝑠𝑜𝑛({ 𝑚𝑒𝑠𝑠𝑎𝑔𝑒: '𝐹𝐵𝑍𝑜𝑛𝑒 𝐴𝑃𝐼 𝑤𝑜𝑟𝑘𝑖𝑛𝑔!', 𝑠𝑡𝑎𝑡𝑢𝑠: '𝑤𝑜𝑟𝑙𝑑𝑤𝑖𝑑𝑒 🌍' });
});

// 𝑆𝐸𝑁𝐷 𝐶𝑂𝐷𝐸
𝑎𝑝𝑝.𝑝𝑜𝑠𝑡('/𝑎𝑝𝑖/𝑎𝑢𝑡ℎ/𝑠𝑒𝑛𝑑-𝑐𝑜𝑑𝑒', 𝑎𝑠𝑦𝑛𝑐 (𝑟𝑒𝑞, 𝑟𝑒𝑠) => {
  𝑐𝑜𝑛𝑠𝑡 { 𝑒𝑚𝑎𝑖𝑙 } = 𝑟𝑒𝑞.𝑏𝑜𝑑𝑦;
  𝑖𝑓 (!𝑒𝑚𝑎𝑖𝑙) 𝑟𝑒𝑡𝑢𝑟𝑛 𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(400).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝐸𝑚𝑎𝑖𝑙 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑' });
  𝑖𝑓 (!𝑡𝑟𝑎𝑛𝑠𝑝𝑜𝑟𝑡𝑒𝑟) 𝑟𝑒𝑡𝑢𝑟𝑛 𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(500).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝐸𝑚𝑎𝑖𝑙 𝑛𝑜𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑒𝑑. 𝐴𝑑𝑑 𝐸𝑀𝐴𝐼𝐿_𝑈𝑆𝐸𝑅 𝑎𝑛𝑑 𝐸𝑀𝐴𝐼𝐿_𝑃𝐴𝑆𝑆 𝑖𝑛 𝑅𝑒𝑛𝑑𝑒𝑟 𝐸𝑛𝑣𝑖𝑟𝑜𝑛𝑚𝑒𝑛𝑡' });

  𝑐𝑜𝑛𝑠𝑡 𝑐𝑜𝑑𝑒 = 𝑀𝑎𝑡ℎ.𝑓𝑙𝑜𝑜𝑟(100000 + 𝑀𝑎𝑡ℎ.𝑟𝑎𝑛𝑑𝑜𝑚() * 900000).𝑡𝑜𝑆𝑡𝑟𝑖𝑛𝑔();
  𝑐𝑜𝑑𝑒𝑠[𝑒𝑚𝑎𝑖𝑙] = { 𝑐𝑜𝑑𝑒, 𝑒𝑥𝑝𝑖𝑟𝑒𝑠: 𝐷𝑎𝑡𝑒.𝑛𝑜𝑤() + 10*60*1000 };

  𝑡𝑟𝑦 {
    𝑎𝑤𝑎𝑖𝑡 𝑡𝑟𝑎𝑛𝑠𝑝𝑜𝑟𝑡𝑒𝑟.𝑠𝑒𝑛𝑑𝑀𝑎𝑖𝑙({
      𝑓𝑟𝑜𝑚: 𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝐸𝑀𝐴𝐼𝐿_𝑈𝑆𝐸𝑅,
      𝑡𝑜: 𝑒𝑚𝑎𝑖𝑙,
      𝑠𝑢𝑏𝑗𝑒𝑐𝑡: '𝐹𝐵𝑍𝑂𝑁𝐸 𝑉𝑒𝑟𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝐶𝑜𝑑𝑒',
      𝑡𝑒𝑥𝑡: `𝑌𝑜𝑢𝑟 𝑐𝑜𝑑𝑒 𝑖𝑠 ${𝑐𝑜𝑑𝑒}`,
      ℎ𝑡𝑚𝑙: `<ℎ2>𝐹𝐵𝑍𝑂𝑁𝐸</ℎ2><𝑝>𝑌𝑜𝑢𝑟 𝑐𝑜𝑑𝑒: <𝑏 𝑠𝑡𝑦𝑙𝑒="𝑓𝑜𝑛𝑡-𝑠𝑖𝑧𝑒:28𝑝𝑥">${𝑐𝑜𝑑𝑒}</𝑏></𝑝><𝑝>𝑉𝑎𝑙𝑖𝑑 10 𝑚𝑖𝑛𝑠. 𝐶ℎ𝑒𝑐𝑘 𝑠𝑝𝑎𝑚 𝑡𝑜𝑜!</𝑝>`
    });
    𝑐𝑜𝑛𝑠𝑜𝑙𝑒.𝑙𝑜𝑔(`𝐶𝑜𝑑𝑒 ${𝑐𝑜𝑑𝑒} -> ${𝑒𝑚𝑎𝑖𝑙}`);
    𝑟𝑒𝑠.𝑗𝑠𝑜𝑛({ 𝑠𝑢𝑐𝑐𝑒𝑠𝑠: 𝑡𝑟𝑢𝑒, 𝑚𝑒𝑠𝑠𝑎𝑔𝑒: '𝐶𝑜𝑑𝑒 𝑠𝑒𝑛𝑡! 𝐶ℎ𝑒𝑐𝑘 𝑖𝑛𝑏𝑜𝑥 & 𝑠𝑝𝑎𝑚' });
  } 𝑐𝑎𝑡𝑐ℎ (𝑒𝑟𝑟) {
    𝑐𝑜𝑛𝑠𝑜𝑙𝑒.𝑒𝑟𝑟𝑜𝑟(𝑒𝑟𝑟);
    𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(500).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑: ' + 𝑒𝑟𝑟.𝑚𝑒𝑠𝑠𝑎𝑔𝑒 });
  }
});

// 𝑉𝐸𝑅𝐼𝐹𝑌 𝐶𝑂𝐷𝐸
𝑎𝑝𝑝.𝑝𝑜𝑠𝑡('/𝑎𝑝𝑖/𝑎𝑢𝑡ℎ/𝑣𝑒𝑟𝑖𝑓𝑦-𝑐𝑜𝑑𝑒', (𝑟𝑒𝑞, 𝑟𝑒𝑠) => {
  𝑐𝑜𝑛𝑠𝑡 { 𝑒𝑚𝑎𝑖𝑙, 𝑐𝑜𝑑𝑒 } = 𝑟𝑒𝑞.𝑏𝑜𝑑𝑦;
  𝑐𝑜𝑛𝑠𝑡 𝑟𝑒𝑐𝑜𝑟𝑑 = 𝑐𝑜𝑑𝑒𝑠[𝑒𝑚𝑎𝑖𝑙];
  𝑖𝑓 (!𝑟𝑒𝑐𝑜𝑟𝑑) 𝑟𝑒𝑡𝑢𝑟𝑛 𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(400).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝑁𝑜 𝑐𝑜𝑑𝑒 𝑠𝑒𝑛𝑡' });
  𝑖𝑓 (𝐷𝑎𝑡𝑒.𝑛𝑜𝑤() > 𝑟𝑒𝑐𝑜𝑟𝑑.𝑒𝑥𝑝𝑖𝑟𝑒𝑠) 𝑟𝑒𝑡𝑢𝑟𝑛 𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(400).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝐶𝑜𝑑𝑒 𝑒𝑥𝑝𝑖𝑟𝑒𝑑' });
  𝑖𝑓 (𝑟𝑒𝑐𝑜𝑟𝑑.𝑐𝑜𝑑𝑒!== 𝑐𝑜𝑑𝑒) 𝑟𝑒𝑡𝑢𝑟𝑛 𝑟𝑒𝑠.𝑠𝑡𝑎𝑡𝑢𝑠(400).𝑗𝑠𝑜𝑛({ 𝑒𝑟𝑟𝑜𝑟: '𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑑𝑒' });
  𝑑𝑒𝑙𝑒𝑡𝑒 𝑐𝑜𝑑𝑒𝑠[𝑒𝑚𝑎𝑖𝑙];
  𝑟𝑒𝑠.𝑗𝑠𝑜𝑛({ 𝑠𝑢𝑐𝑐𝑒𝑠𝑠: 𝑡𝑟𝑢𝑒 });
});

// 𝐾𝑒𝑒𝑝 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑠 𝑟𝑜𝑢𝑡𝑒 - 𝑏𝑢𝑡 𝑑𝑜𝑛'𝑡 𝑐𝑟𝑎𝑠ℎ 𝑖𝑓 𝑚𝑖𝑠𝑠𝑖𝑛𝑔
𝑡𝑟𝑦 {
  𝑐𝑜𝑛𝑠𝑡 𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑅𝑜𝑢𝑡𝑒𝑠 = 𝑟𝑒𝑞𝑢𝑖𝑟𝑒('./𝑟𝑜𝑢𝑡𝑒𝑠/𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑠');
  𝑎𝑝𝑝.𝑢𝑠𝑒('/𝑎𝑝𝑖/𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑠', 𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑅𝑜𝑢𝑡𝑒𝑠);
} 𝑐𝑎𝑡𝑐ℎ (𝑒) {
  𝑐𝑜𝑛𝑠𝑜𝑙𝑒.𝑙𝑜𝑔('𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑠 𝑟𝑜𝑢𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑠𝑘𝑖𝑝𝑝𝑖𝑛𝑔');
}

𝑐𝑜𝑛𝑠𝑡 𝑃𝑂𝑅𝑇 = 𝑝𝑟𝑜𝑐𝑒𝑠𝑠.𝑒𝑛𝑣.𝑃𝑂𝑅𝑇 || 10000;
𝑎𝑝𝑝.𝑙𝑖𝑠𝑡𝑒𝑛(𝑃𝑂𝑅𝑇, '0.0.0.0', () => {
  𝑐𝑜𝑛𝑠𝑜𝑙𝑒.𝑙𝑜𝑔(`𝑆𝑒𝑟𝑣𝑒𝑟 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑜𝑛 𝑝𝑜𝑟𝑡 ${𝑃𝑂𝑅𝑇}`);
});
>>>>>>> c3e9e34 (fix email and crash)
