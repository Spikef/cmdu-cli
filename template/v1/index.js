#!/usr/bin/env node

'use strict';

var app = require('cmdu');

app.version = require('../package.json').version;

app
    .option('-f, --first', 'first option for default command')
    .action(function () {
        console.log('hello world!');
    });

app.listen();