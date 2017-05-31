var fs = require('fs');
var path = require('path');
var locale = require('os-locale');

var location = locale.sync() || 'en-US';
location = location.replace(/\..+$/, '');
location = location.replace(/_/, '-');

var question = path.resolve(__dirname, 'questions_' + location + '.js');

if (fs.existsSync(question)) {
    question = require(question)
} else {
    question = require('./questions_en-US');
}

var tooltip = path.resolve(__dirname, 'tooltips_' + location + '.js');

if (fs.existsSync(tooltip)) {
    tooltip = require(tooltip)
} else {
    tooltip = require('./tooltips_en-US');
}

module.exports = { location: location, questions: question, tooltips: tooltip };