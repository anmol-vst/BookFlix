 function generateVerifictionEmailTemplate(otpCode){
    return `<div style="font-family: Arial, sans-serif; 
            max-width: 400px; 
            margin: 20px auto; 
            padding: 20px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            text-align: center; 
            background-color: #ddd;">
  <h2 style="margin:0; color: #333;">Bookworm Verification Code</h2>
  <div style="margin-top:20px; 
              font-size:28px; 
              font-weight:bold; 
              letter-spacing:6px; 
              color:#000;">
    ${otpCode}
  </div>
</div>
`
  
}
module.exports={generateVerifictionEmailTemplate}