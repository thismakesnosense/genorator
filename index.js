const puppeteer = require('puppeteer');
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
   
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    },
  ]);
}




function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container bg-${answers.color}">
    <h1 class="display-4">Hi! My name is ${answers.name}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.login}</li>
      <li class="list-group-item">My GitHub bio ${answers.bio}</li>
      
      
    </ul>
  </div>
</div>
</body>
</html>`;
}



promptUser()
  .then(function(gitanswers){
  return axios.get(`https://api.github.com/users/${gitanswers.github}`).then(function(res){
    let htmlanswers = {
      bio: res.data.bio,
      location: res.data.location,
      color: "danger",
      name: res.data.name,
      login: res.data.login,
    }
    return htmlanswers
        // console.log(res.data)
     }).catch(function(err){
       console.error(err)
     })
  })
  .then(function(htmlanswers) {
    const html = generateHTML(htmlanswers);

    return writeFileAsync("pdf.html", html);
  })
  .then(function() {
    (async () => {
        const browser = await puppeteer.launch();
    
        const page = await browser.newPage();
    
        const html = fs.readFileSync("./pdf.html", "utf8");
    
        await page.setContent(html);
        await page.pdf({
            path: 'page.pdf'
        });
    
        await browser.close();
    })(); 
    
    console.log("Successfully wrote to pdf.html");
  })
  .catch(function(err) {
    console.log(err);
  });

 