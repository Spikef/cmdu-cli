var fs = require('fs');
var path = require('path');

var language = process.env.LANG || 'en-US';
language = language.replace(/\..+$/, '');
language = language.replace(/_/, '-');

var question = path.resolve(__dirname, 'questions_' + language + '.js');

if (fs.existsSync(question)) {
    question = require(question)
} else {
    question = require('./questions_en-US');
}

var tooltip = path.resolve(__dirname, 'tooltips_' + language + '.js');

if (fs.existsSync(tooltip)) {
    tooltip = require(tooltip)
} else {
    tooltip = require('./tooltips_en-US');
}

module.exports = { questions: question, tooltips: tooltip };