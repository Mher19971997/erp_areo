const dotenv = require('dotenv');
const { merge } = require('lodash');
const fs = require('fs');
const path = require('path');
const json5 = require('json5');

class ConfigService {
    constructor() {
        this.configMap;
        const cwd = process.cwd();

        const envFile = path.resolve(cwd, 'config', `local.env`);
        const lConfigMap = dotenv.config({ path: envFile }).parsed;

        const confFile = path.resolve(cwd, 'config', 'conf.json5');

        const env = `${process.env['app.env'] || 'local'}`;
        const vConfFile = path.resolve(cwd, 'config', `config-${env}.json5`);
        const configMap = json5.parse(fs.readFileSync(confFile).toString('utf8'));
        let vConfigMap = {};
        try {
            vConfigMap = json5.parse(fs.readFileSync(vConfFile).toString('utf8'));
        } catch (err) { }

        this.configMap = merge(configMap, lConfigMap, vConfigMap);
        this.parse();
    }

    get = (key) => {
        return this.configMap[key];
    };

    parse = () => {
        for (const name in this.configMap) {
            const config = this.configMap[name];
            this.merge(this.configMap, config, name);
        }
    };

    set = (configs, name, joinedKey) => {
        const data = this.get(joinedKey);
        const envData = process.env[joinedKey];

        data && (configs[name] = this.typeCast(data));
        envData && (configs[name] = this.typeCast(envData));
        if (!envData && (typeof data === 'string' || typeof data === 'number')) {
            process.env[joinedKey] = `${data}`;
        }
        this.configMap[joinedKey] = configs[name];
    };

    merge = (configs, config, name, joinedKey) => {
        if (joinedKey) {
            joinedKey = `${joinedKey}.${name}`;
        } else {
            joinedKey = name;
        }
        if (typeof config !== 'object') {
            this.set(configs, name, joinedKey);
        } else if (typeof config === 'object') {
            for (const subName in config) {
                const sConfig = configs[name];
                this.set(configs, name, joinedKey);
                if (sConfig) {
                    this.merge(configs[name], sConfig[subName], subName, joinedKey);
                }
            }
        }
    };

    typeCast = (data) => {
        if (data === 'true') {
            data = true;
        }
        if (data === 'false') {
            data = false;
        }
        return data;
    };
}

module.exports = new ConfigService();