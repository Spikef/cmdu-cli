#!/usr/bin/env node

var fs = require('../lib/fs-plus');
var local = require('../lib/localize');
var path = require('path');
var io = require('inquirer');
var chalk = require('chalk');
var app = require('cmdu');
var child = require('child_process');

app.version = require('../package.json').version;

var asks = local.questions;
var tips = local.tooltips;

// npm publish bug#5082 makes that read from template/index.js is impossible.
var main = [
    "#!/usr/bin/env node",
    "",
    "'use strict';",
    "",
    "var app = require('cmdu');",
    "",
    "app.version = require('../package.json').version;",
    "",
    "app.action(function () {",
    "    console.log('hello world!');",
    "});",
    "",
    "app.listen();"
].join('\n');

app
    .describe(tips.description)
    .option('-h, --help', tips.desc_help)
    .option('-v, --version', tips.desc_version)
    .action(function () {
        console.log('\n' + chalk.cyan(tips.start_tip) + '\n');

        io.prompt(asks)
            .then(function (answers) {
                var target = path.resolve(process.cwd(), answers.name);
                var binary = path.resolve(target, 'bin');

                var error = null;

                try {
                    fs.mkdirSync(target);
                    fs.mkdirSync(binary);

                    var packet = require('../template/package.json');
                    packet.name = answers.name;
                    packet.bin = {};
                    packet.bin[answers.cmd] = './bin/' + answers.index + '.js';
                    fs.writeFileSync(path.resolve(target, 'package.json'), JSON.stringify(packet, null, 2));
                    console.log(tips.create, 'package.json');

                    fs.writeFileSync(path.resolve(binary, answers.index + '.js'), main);
                    console.log(tips.create, 'bin/' + answers.index + '.js');
                    console.log('');
                } catch (e) {
                    fs.existsSync(target) && fs.deldirSync(target);

                    console.error(e);
                    error = e.message;
                }

                return new Promise((resolve, reject) => {
                    if (error) {
                        reject();
                    }else{
                        var args = {
                            target: target,
                            name: answers.cmd
                        };

                        resolve(args);
                    }
                })
            })
            .then(function (args) {
                var target = args.target;
                var spawn = child.spawnSync;
                var result;

                console.log(tips.dependencies);
                result = spawn('npm', ['install', 'cmdu', '--save'], { cwd: target, stdio: 'inherit'});
                if (result.status != 0) {
                    console.log('');
                    console.log(tips.depend_fail);
                    process.exit(0);
                }

                result = spawn('npm', ['link'], { cwd: target, stdio: 'inherit'});
                if (result.status != 0) {
                    console.log('');
                    console.log(tips.depend_fail);
                    process.exit(0);
                }

                console.log('');
                console.log(tips.complete, args.name);
            })
    });

app.listen();