const fs=require('fs');
const html=fs.readFileSync('complete.html','utf8');

// Count open vs close divs
const open=(html.match(/<div[\s>]/gi)||[]).length;
const close=(html.match(/<\/div>/gi)||[]).length;
console.log('DIV open:',open,'close:',close,'balanced:',open===close);

// Extract JS from script tags and check syntax
const scripts=html.match(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi)||[];
let jsErr=0;
scripts.forEach((s,i)=>{
  if(s.includes('src='))return;
  const code=s.replace(/<\/?script[^>]*>/gi,'');
  try{new Function(code);}catch(e){console.log('JS error in script',i+':',e.message);jsErr++;}
});
const inlineCount=scripts.filter(s=>!s.includes('src=')).length;
console.log('JS inline scripts:',inlineCount,'errors:',jsErr);

// Check h+= div balance
const hLines=html.split('\n').filter(l=>l.trim().startsWith("h+='"));
let openH=0,closeH=0;
hLines.forEach(l=>{
  openH+=(l.match(/<div[\s>]/gi)||[]).length;
  closeH+=(l.match(/<\/div>/gi)||[]).length;
});
console.log('h+= div open:',openH,'close:',closeH,'balanced:',openH===closeH);
