#!/usr/bin/env node

const path = require('path');
const _ = require('lodash');
const glob = require('glob-promise');
const ejs = require('ejs');
const inquirer = require('inquirer');
const { pascalCase } = require('pascal-case');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const chalk = require('chalk');

(async () => {
    try {
        const { package, pluginName, route } = await inquirer.prompt([
            {
                type: 'string',
                name: 'package',
                message: 'kebab-case package name',
                filter: (input) => _.kebabCase(input),
            },
            {
                type: 'string',
                name: 'pluginName',
                message: 'PascalCase plugin name',
                default: ({ package }) => pascalCase(package),
                filter: (input) => pascalCase(input),
            },
            {
                type: 'string',
                name: 'route',
                message: 'Route path',
                default: ({ package }) => `/${package}`,
                filter: (input) => (input.startsWith('/') ? input : `/${input}`),
            },
        ]);
        const templateDir = path.join(__dirname, 'template');
        const targetDir = path.join(process.cwd(), package);

        try {
            await fs.stat(targetDir);
            // stats succeeded, meaning file/dir exists, error
            console.log(chalk.red('error') + ' directory ' + chalk.yellow(targetDir) + ' exists, please change package name or remove the directory.');
            return;
        } catch (e) {
            // directory does not exist, we're good, otherwise throw
            if (e.code !== 'ENOENT') throw e;
        }

        await mkdirp(targetDir);

        const data = {
            // final route in discourse
            route,
            // npm package name
            package,
            // RoR gem & module name (PascalCase)
            pluginName,
            // names required by discourse to work properly
            pluginNameSnake: _.snakeCase(pluginName),
            pluginNameKebab: _.kebabCase(pluginName),
        };

        const files = await glob(path.join(templateDir, '**'), { mark: true, dot: true });
        for (const file of files) {
            let destination = file.replace(templateDir, targetDir);
            for (const key in data) {
                destination = destination.replace(`{${key}}`, data[key]);
            }
            if (file.endsWith('/')) { // dir
                await mkdirp(destination);
                console.log(chalk.blue('mkdir') + ' ' + destination);
            } else { // file
                if (file.endsWith('.ejs')) { // template
                    destination = destination.replace(/\.ejs$/, '');
                    const content = await ejs.renderFile(file, data);
                    await fs.writeFile(destination, content);
                    console.log(chalk.green('ejs') + ' ' + destination);
                } else { // copy onle
                    await fs.copy(file, destination);
                    console.log(chalk.magenta('copy') + ' ' + destination);
                }
            }
        }

        console.log('Scaffold succeeded! Now you can run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + ' to install dependencies and build your app!');
        console.log('See ' + chalk.blue('README.md') + ' in ' + chalk.yellow(targetDir) + ' for mode details.');
    } catch (e) {
        console.error(e);
    }
})();
