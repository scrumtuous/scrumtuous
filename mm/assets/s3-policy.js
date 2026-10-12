// Local-only format checker and policy generator. No AWS requests.
const reservedPrefixes=['xn--','sthree-','amzn-s3-demo-'];
const reservedSuffixes=['-s3alias','--ol-s3','.mrap','--x-s3','--table-s3','-an'];
function validateBucketName(name){
  const checks=[
    {id:'length',ok:name.length>=3&&name.length<=63,message:'Use 3–63 characters.'},
    {id:'characters',ok:/^[a-z0-9.-]+$/.test(name),message:'Use lowercase letters, numbers, hyphens or periods. No spaces or underscores.'},
    {id:'edges',ok:/^[a-z0-9].*[a-z0-9]$/.test(name),message:'Start and end with a lowercase letter or number.'},
    {id:'dots',ok:!name.includes('..'),message:'Do not use consecutive periods.'},
    {id:'ip',ok:!/^\d{1,3}(\.\d{1,3}){3}$/.test(name),message:'Do not use an IPv4-style address as the name.'},
    {id:'reserved',ok:!reservedPrefixes.some(p=>name.startsWith(p))&&!reservedSuffixes.some(p=>name.endsWith(p)),message:'Avoid reserved prefixes and suffixes listed below.'},
  ];
  return {valid:checks.every(c=>c.ok),checks};
}
function bucketPolicy(name){return {Version:'2012-10-17',Statement:[{Sid:'PublicReadGetObject',Effect:'Allow',Principal:'*',Action:['s3:GetObject'],Resource:[`arn:aws:s3:::${name}/*`]}]};}
const input=document.getElementById('bucket-name'),code=document.getElementById('policy-code');
function updatePolicy(){
  const name=input.value,result=validateBucketName(name);
  input.setAttribute('aria-invalid',String(!result.valid));
  document.getElementById('bucket-status').textContent=result.valid?'Format looks valid. AWS name availability is not checked.':'Fix the name before copying or downloading the policy.';
  document.getElementById('bucket-status').className=result.valid?'bucket-status good':'bucket-status bad';
  for(const check of result.checks){const el=document.getElementById('rule-'+check.id);el.textContent=(check.ok?'✓ ':'✗ ')+check.message;el.className=check.ok?'good':'bad';}
  code.textContent=result.valid?JSON.stringify(bucketPolicy(name),null,2):'Enter a valid bucket name above to generate the policy.';
  document.getElementById('copy-policy').disabled=!result.valid;document.getElementById('download-policy').disabled=!result.valid;
  document.getElementById('policy-action-status').textContent='';
  document.getElementById('dots-note').hidden=!result.valid||!name.includes('.');
}
input.addEventListener('input',updatePolicy);
document.getElementById('use-example').addEventListener('click',()=>{input.value='maple-ui-yourname-7f3a';updatePolicy();});
document.getElementById('copy-policy').addEventListener('click',async()=>{
 if(!validateBucketName(input.value).valid)return;
 const status=document.getElementById('policy-action-status');
 try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(code.textContent);status.textContent='Policy copied. Paste it into this bucket’s Bucket policy editor.';}
 catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(code);selection.removeAllRanges();selection.addRange(range);status.textContent='Policy selected. Press Ctrl+C (Windows) or Command+C (Mac), then paste into S3.';}
});
document.getElementById('download-policy').addEventListener('click',()=>{
 if(!validateBucketName(input.value).valid)return;
 const blob=new Blob([code.textContent+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=input.value+'-public-read-policy.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('policy-action-status').textContent='Policy JSON downloaded.';
});
updatePolicy();
