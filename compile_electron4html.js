const fs = require("fs");

const publichtml = "public/toppage.html";
const outputFolder = "public";
const electronhtml = `${outputFolder}/_index.html`;

const saveHTML = (newdata) => {
    console.log(`save new html[${electronhtml}]...`);
    fs.writeFile(electronhtml,newdata,(err2) => {
        if (err2) {
            console.log(err2);
        }else{
            console.log("...ok");
            console.log("next step is 'npm run build:****'. ");
        }
    });
}
console.log("=======================================");
console.log("Start to compile HTML for the Electron.");
console.log(`opening ${publichtml}...`);
fs.readFile(publichtml,{
    encoding : "utf-8",
},(err, data) => {
    console.log(" ");
    if (err) {
        console.log(err);
    }else{
        console.log("...ok");
        console.log(" ");
        console.log("Changing vue.js on CDN to production mode.");
        var newdata = data.replace(/<\$.+\$>/g,"prod.");
    
        if (fs.existsSync(outputFolder)) {
            saveHTML(newdata);
        }else{
            console.log(`output folder [${outputFolder}] is not exists.`);
            console.log("creating...");
            fs.mkdir("dist_html",(err) => {
                if (err) {
                    console.log(err);
                }else{
                    console.log("...ok");
                    saveHTML(newdata);
                }
                
            });
        }
        
    }
});