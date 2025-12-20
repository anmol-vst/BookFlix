const catchAsyncErrors = (theFunction)=>{
  
    return (req,res,next)=>{
         
        Promise.resolve(theFunction(req,res,next)).catch(next);
           console.log("execution is here")
    }
}
module.exports= {catchAsyncErrors};
