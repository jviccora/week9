const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

const questions = [
  "What is your GitHub user name?",
  "What is the name of the project (or README file)?",
  "Give a brief description of the project",
  "What type of licesce should the project have?",
  "What is the command to install dependencies?",
  "What is the command to run tests?",
  "What knowledge is required to use this repository?",
  "What knowledge is required to contribute to this repository?"
];

let init = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: questions[0]
      },
      {
        type: "input",
        name: "project",
        message: questions[1]
      },
      {
        type: "input",
        name: "description",
        message: questions[2]
      },
      {
        type: "list",
        message: questions[3],
        name: "license",
        choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"]
      },
      {
        type: "input",
        name: "installation",
        message: questions[4]
      },
      {
        type: "input",
        name: "tests",
        message: questions[5]
      },
      {
        type: "input",
        name: "usage",
        message: questions[6]
      },
      {
        type: "input",
        name: "contributing",
        message: questions[7]
      }
    ])
    .then(function(response) {
      const queryUrl = `https://api.github.com/users/${response.username}`;

      axios
        .get(queryUrl)
        .then(function(res) {
          writeFile({ ...response, ...res.data });
        })
        .catch(err => console.log(err));

      //   const repoNamesStr = repoNames.join("\n");
    })
    .catch(err => console.log(err));
};

let writeFile = data => {
  console.log(data);
  let repoNamesStr = `
# ${data.project}
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](${data.html_url})
    
## Description
    
${data.description}

## Table of Contents

* [Installation](#installation)

* [Usage](#usage)
    
* [License](#license)	
    
* [Contributing](#contributing)
    
* [Tests](#tests)
    
* [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

${data.installation}

## Usage

${data.usage}

## License

This project is licensed under the MIT license.
  
## Contributing

${data.contributing}

## Tests

To run tests, run the following command:

${data.tests}

## Questions

<img src="${data.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />

If you have any questions about the repo, open an issue or contact [${data.login}](${data.html_url}) directly at null.
    `;
  fs.writeFile(`${data.project}.md`, repoNamesStr, function(err) {
    if (err) {
      throw err;
    }
  });
};

init();
