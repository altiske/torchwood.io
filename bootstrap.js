// once upon a time waiting on a sunny day ... i was trying to bootup head start and started hating it.)

const process = require("process");
const path = require("path");
const fs = require("fs");
const fileExtension = require('file-extension');
const gulpSass = require("gulp-sass");
const chalk = require("chalk");

// Properties related to task with files and need validation!
const sass = new Map;
const js = new Map;
const concat = new Map;

// reusable properties
const cwd = module.exports.cwd = process.cwd();
const src = module.exports.src = process.cwd() + "/src";
const app = module.exports.app = __dirname;

module.exports.boot = function() {
  const settings = require("./src/settings");

  if (settings.assets === true) {
    if (
      settings.files.assets instanceof Object &&
      Object.keys(settings.files.assets).length > 0
    ) {
      for (key in settings.files.assets) {
        const value = settings.files.assets[key];
        const extention = fileExtension(value);
        let directory = cwd+"/src/"+extention;

        // 1. check on file type
        if (!["js", "sass", "scss"].includes(extention)) {
          console.log(`${chalk.red("ERROR: ")} the filetype of the file '${chalk.yellow(value)}' ins't allowed inside te property ${chalk.blue(module.exports.assets)}. Only .js, .scss, .sass is allowed`);
          process.exit();
        }

        if ([!"sass", "scss"].includes(extention)) {
          directory = cwd+"/src/sass";
        }

        // 2. check if file exists
        const file = path.join(directory, value); // todo: to replace and only keep a-z and 0-9 for secureity reasons

        if (!fs.existsSync(file)) {
          // Block compiling when a file doesn't exist
          console.log(`${chalk.red("ERROR: ")} the file '${chalk.yellow(file)}' doesn't exist`);
          process.exit();
        }

        // 3. add to map
        switch (fileExtension(file)) {
          case "sass":
          case "scss":
            sass.set(key, value);
            break;
          case "js":
            js.set(key, value);
            break;
        }
      }
    }

    if (settings.concat === true) {
      if (
        settings.files.concat instanceof Object &&
        Object.keys(settings.files.concat).length > 0
      ) {
        for (key in settings.files.concat) {
          const files = settings.files.concat[key];
  
          if (!Array.isArray(files)) {
            console.warn(chalk.red(`property ${key} of concat isn't of the type Array`));
            process.exit();
          }

          // Check if every file exists
          files.forEach(value => {
            const file = path.join(process.cwd()+"/src/concat", value);

            if (!fs.existsSync(file)) {
              console.log(chalk.red(`the file '${value}' doesn't exist inside te property module.exports.concat`));
              process.exit(); // kill the task before a task can be performed      
            }
          });

          concat.set(key, files);
        }
      }
    }
  }

};

module.exports.sass = sass;
module.exports.js = js;
module.exports.concat = concat;