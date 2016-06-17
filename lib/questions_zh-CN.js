var fs = require('fs');
var path = require('path');

module.exports = [
    {
        type: 'input',
        name: 'name',
        message: '项目名称',
        validate: function (val) {
            return !val ? '项目名称不能为空' : fs.existsSync('./' + val) ? '项目已存在' : true;
        }
    },
    {
        type: 'input',
        name: 'cmd',
        message: '命令名称',
        validate: function (val) {
            return val ? true : '命令名称不能为空';
        }
    },
    {
        type: 'list',
        name: 'index',
        message: '入口文件名称',
        choices: function (answers) {
            var array = [answers.cmd, 'index', 'start'];
            if (answers.name !== answers.cmd) array.unshift(answers.name);
            return [answers.name, answers.cmd, 'index', 'start']
        },
        default: 'index'
    }
];