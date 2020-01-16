const sequelize = './init.js'.sequelize;

const Sequelize = require('sequelize');

//rammetrics table model
const snpmSchema = sequelize.define('rammetrics', {
    TotalRAM: {
        type: Sequelize.BIGINT
    },
    FreeRAM: {
        type: Sequelize.BIGINT
    }
});

//Inserts SNMP records in database based on JSON object returned from snmpProbe service
const insertSNMPRecords = (SNMPMetrics) => {

    let { freeRam, totalRam } = SNMPMetrics;
    snpmSchema.create({FreeRAM: freeRam, TotalRAM: totalRam});
};


//Select all SNMP records in database
const selectSNMPRecords = async () => {
    let ram_JSONlogs = {"success": true, "message": "all RAM records in database"};
    let arrayLogs = [];
    const data = await snpmSchema.findAll({raw: true, order: [['id', 'DESC']]});

    for (let entry of data) {
        arrayLogs.push(entry);
    }
    ram_JSONlogs.data = arrayLogs;

    return ram_JSONlogs;
};

module.exports = {
    snpmSchema,
    insertSNMPRecords,
    selectSNMPRecords
};
