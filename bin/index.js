#!/usr/bin/env node

var fs = require('../lib/fs-plus');
var local = require('../lib/localize');
var path = require('path');
var io = require('inquirer');
var chalk = require('chalk');
var app = require('cmdu');
var child = require('child_process');
var spawn = child.spawnSync;

app
    .language(local.location)
    .version = require('../package.json').version;

var asks = local.questions;
var tips = local.tooltips;

app
    .describe(tips.description)
    .action(function() {
        console.log('\n' + chalk.cyan(tips.start_tip) + '\n>> ' + chalk.blue(process.cwd()) + '\n');

        io.prompt(asks)
            .then(function (answers) {
                var target = path.resolve(process.cwd(), answers.name);
                var binary = path.resolve(target, 'bin');

                var error = null;

                try {
                    fs.mkdirSync(target);
                    fs.mkdirSync(binary);

                    var packet = require('../template/' + answers.version + '/package.js');
                    packet.name = answers.name;
                    packet.bin = {};
                    packet.bin[answers.cmd] = './bin/' + answers.index + '.js';
                    fs.writeFileSync(path.resolve(target, 'package.json'), JSON.stringify(packet, null, 2));
                    console.log(tips.create, 'package.json');

                    var index = fs.readFileSync(path.resolve(__dirname, '../template', answers.version, 'index.js'), 'utf8');
                    fs.writeFileSync(path.resolve(binary, answers.index + '.js'), index);
                    console.log(tips.create, 'bin/' + answers.index + '.js');
                    console.log('');
                } catch (e) {
                    fs.existsSync(target) && fs.deldirSync(target);

                    console.error(e);
                    error = e.message;
                }

                return new Promise(function(resolve, reject) {
                    if (error) {
                        reject();
                    }else{
                        var args = {
                            target: target,
                            name: answers.cmd,
                            version: answers.version.substring(1)
                        };

                        resolve(args);
                    }
                })
            })
            .then(function (args) {
                var target = args.target;
                var result;

                console.log(tips.dependencies);
                result = spawn('npm', ['install', 'cmdu@' + args.version, '--save'], { cwd: target, stdio: 'inherit'});
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
            });
    });


app
    .command('unlink', tips.unlink)
    .action(function() {
        var cwd = process.cwd();
        var pkg = path.resolve(cwd, 'package.json');

        if (!fs.existsSync(pkg)) return;

        pkg = require(pkg);
        if (!pkg.name || !pkg.bin) return;

        var name = pkg.name;

        spawn('npm', ['uninstall', '-g', name], { stdio: 'inherit' });
    });

app.listen();