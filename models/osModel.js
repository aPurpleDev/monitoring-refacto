const db = require('./init.js').db;
sequelize = db.sequelize;
Sequelize = db.Sequelize;
const Op = Sequelize.Op;

const osutils = require('os-utils');
const osu = require('node-os-utils');
const cpu = osu.cpu;

//Osmetrics table model
const osSchema = sequelize.define('osmetrics', {
    cpuUsage: {
        type: Sequelize.DECIMAL(10, 2)
    },
    cpuFree: {
        type: Sequelize.DECIMAL(10, 2)
    },
    freeMem: {
        type: Sequelize.DECIMAL(10, 2)
    },
    usedMem: {
        type: Sequelize.DECIMAL(10, 2)
    }
});

//Called upon app starts. Insert OS Metrics into DB from the metrics object
const insertOSRecords = async () => {
    const metrics = {};

    await cpu.usage().then((data) => {
        metrics.cpuUsage = data.toFixed(2);
        metrics.cpuFree = (100 - data).toFixed(2);
    }).catch(e => console.log(e));

    metrics.freememPercentage = (osutils.freememPercentage() * 100).toFixed(2);
    metrics.usedmemPercentage = (100 - (osutils.freememPercentage() * 100)).toFixed(2);

    osSchema.create({
        cpuUsage: metrics.cpuUsage,
        cpuFree: metrics.cpuFree,
        freeMem: metrics.freememPercentage,
        usedMem: metrics.usedmemPercentage
    });
    module.exports.metrics = metrics;
};

//Select all OSRecords from the osSchema table
const selectOSRecords = async () => {
    let os_JSONlogs = {"success": true, "message": "all OS records in database"};
    let arrayLogs = [];
    const data = await osSchema.findAll({raw: true, order: [['id', 'DESC']]});
    for (let entry of data) {
        arrayLogs.push(entry);
    }
    os_JSONlogs.data = arrayLogs;

    return os_JSONlogs;
};

//Select X oldest records of osmetrics, where X = limiter
const selectXOldestOSRecords = async (limiter) => {
    const data = await osSchema.findAll({limit: limiter, raw: true});
    let os_JSONlogs = {"success": true, "message": `Selected oldest ${limiter} records in database`};
    let arrayLogs = [];
    for (let entry of data) {
        arrayLogs.push(entry);
    }
    os_JSONlogs.data = arrayLogs;

    return os_JSONlogs;
};

//Select X most recent records of osmetrics, where X = limiter
const selectXNewestOSRecords = async (limiter) => {
    const data = await osSchema.findAll({limit: limiter, raw: true, order: [
            ['id', 'DESC']]});
    let os_JSONlogs = {"success": true, "message": `Selected newest ${limiter} records in database`};
    let arrayLogs = [];
    for (let entry of data) {
        arrayLogs.push(entry);
    }
    os_JSONlogs.data = arrayLogs;

    return os_JSONlogs;
};

//Select records that were created inclusively in between (attribute createdAt) startDate and endDate
const selectOSRecordsByDates = async (startDate, endDate) => {
    let jsStartDate = new Date(startDate);
    let jsEndDate = new Date(endDate);
    let os_JSONlogs = {"success": true, "message": `records of OS metrics within ${jsStartDate} and ${jsEndDate}`};
    let arrayLogs = [];
    const data = await osSchema.findAll({
        raw: true,
        order: [['id', 'DESC']],
        where: {createdAt: {[Op.between]: [jsStartDate, jsEndDate]}}
    });
    for (let entry of data) {
        arrayLogs.push(entry);
    }
    os_JSONlogs.data = arrayLogs;

    return os_JSONlogs;
};

//Select records where CPU usage was higher or equal than X, where X = usage
const selectOSRecordsAboveUsage = async (usage) => {
    let os_JSONlogs = {"success": true, "message": `records of CPU usage equal or higher than ${usage}`};
    let arrayLogs = [];
    const data = await osSchema.findAll({
        raw: true,
        order: [['id', 'DESC']],
        where: {cpuUsage: {[Op.gte]: usage}}
    });
    for (let entry of data) {
        arrayLogs.push(entry);
    }
    os_JSONlogs.data = arrayLogs;

    return os_JSONlogs;
};

//Deletes all records from osmetrics table
const dropOSTable = async () => {
    await osSchema.destroy({
        where: {},
        truncate: true
    });
};

//Deletes oldest X records from the osmetrics table, where X = cutoff
const deleteOSRecords = async (cutoff) => {
    await sequelize.query(`DELETE FROM osmetrics WHERE ctid IN (SELECT ctid FROM osmetrics ORDER BY id LIMIT :cutoff);`, {
        replacements: {cutoff: parseInt(cutoff)},
        type: sequelize.QueryTypes.SELECT
    });
    return `Deleted oldest ${parseInt(cutoff)} rows in the osmetrics table`;
};

//Deletes records of cpuUsage strictly inferior to X, where X = usage
const deleteOSRecordsBelowUsage = async (usage) => {
    await sequelize.query(`DELETE FROM osmetrics WHERE "cpuUsage" < :usage`, {
        replacements: {cpuCutoff: parseInt(usage)},
        type: sequelize.QueryTypes.DELETE
    });
    return `Deleted records where cpu usage was below ${parseInt(usage)} in the osmetrics table`;
};

//Deletes all OSTable records with IDs contained within args. TODO review first args param treatment
const deleteOSRecordsByIds = (args) => {
    if(typeof args === 'string')
    {
        const spliceIds = args.split(',');
        for(let arg of spliceIds){
            sequelize.query(`DELETE FROM osmetrics WHERE "id" = :arg`, {
                replacements: {arg: parseInt(arg)},
                type: sequelize.QueryTypes.DELETE
            })
                .then( () => `Deleted OSMetrics records where ID was found in " ${args.toString()} " in the osmetrics table` )
                .catch( (e) => console.log(e));
        }
    }else if(args[Symbol.iterator] === 'function'){
        for(let arg of args) {
            sequelize.query(`DELETE FROM osmetrics WHERE "id" = :arg`, {
                replacements: {arg: parseInt(arg)},
                type: sequelize.QueryTypes.DELETE
            })
                .then( () => `Deleted OSMetrics records where ID was found in " ${args.toString()} " in the osmetrics table` )
                .catch((e) => console.log(e));
        }
    }
};

module.exports = {
    osSchema,
    insertOSRecords,
    selectOSRecords,
    selectXOldestOSRecords,
    selectXNewestOSRecords,
    selectOSRecordsByDates,
    selectOSRecordsAboveUsage,
    dropOSTable,
    deleteOSRecords,
    deleteOSRecordsBelowUsage,
    deleteOSRecordsByIds
};
