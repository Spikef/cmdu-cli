module.exports = {
    "name": "{name}",
    "description": "The first cli",
    "version": "1.0.0",
    "author": "",
    "repository": {
        "type": "git",
        "url": "https://github.com/"
    },
    "keywords": [
        "command",
        "cli"
    ],
    "files": [
        "lib",
        "bin"
    ],
    "bin": {
        "{cmd}": "./bin/{index}.js"
    },
    "dependencies": {},
    "devDependencies": {},
    "scripts": {},
    "engine-strict": true,
    "engines": {
        "node": ">= 4.0"
    },
    "license": "MIT"
};