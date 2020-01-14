const Sequelize = require('sequelize');

import { osSchema }  from './osModel.js';
import { snpmSchema }  from './snmpModel.js';


const DBURL = `postgres://postgres:softia@192.168.10.65:5432/Monitoring`;
let isInit = false;

const sequelize = new Sequelize(DBURL, {
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 1
    }
});

//initializes DB connection, called at server start. Singleton
const initDB = () => {
    if (isInit === false) {

        osSchema.sync().catch((e) => console.log(e));
        snpmSchema.sync().catch((e) => console.log(e));
        sequelize.authenticate().catch((e) => console.log(e));

        isInit = true;
    }
};

module.exports = {
    sequelize,
    initDB
};
