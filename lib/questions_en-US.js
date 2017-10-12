var fs = require('fs');

module.exports = [
    {
        type: 'list',
        name: 'version',
        message: 'Version of cmdu',
        choices: ['v1', 'v2'],
        default: 'v2'
    },
    {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        validate: function (val) {
            return !val ? 'Project name cannot be empty' : fs.existsSync('./' + val) ? 'Project already exist' : true;
        }
    },
    {
        type: 'input',
        name: 'cmd',
        message: 'Your command name',
        validate: function (val) {
            return val ? true : 'Command name cannot be empty';
        }
    },
    {
        type: 'list',
        name: 'index',
        message: 'The index file name',
        choices: function (answers) {
            var array = [answers.cmd, 'index', 'start'];
            if (answers.name !== answers.cmd) array.unshift(answers.name);
            return [answers.name, answers.cmd, 'index', 'start']
        },
        default: 'index'
    }
];