const puppeteer = require('puppeteer');
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?"
    },
    {
      type: "input",
      name: "location",
      message: "Where are you from?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn URL."
    }
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
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">Link to my GitHub <link href="https://github.com/${answers.github}">
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

promptUser()
  .then(function(answers) {
    const html = generateHTML(answers);

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

// (async () => {
//     const browser = await puppeteer.launch();

//     const page = await browser.newPage();

//     const html = fs.readFileSync("./pdf.html", "utf8");

//     await page.setContent(html);
//     await page.pdf({
//         path: 'page.pdf'
//     });

//     await browser.close();
// })();  