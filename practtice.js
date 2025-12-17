const fs=require("fs");
async function readfile(){
    const response=await fs.readFile("jsndaj.txt");
}

function sync(){
    console.log("message sync");
}
readfile();
sync();