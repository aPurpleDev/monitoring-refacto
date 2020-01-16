const Sequelize = require('sequelize');

const osSchema = require('./osModel.js').osSchema;
const snpmSchema = require('./snmpModel.js').snpmSchema;

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

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
    sequelize,
    db,
    initDB
};
