const controller = require('../controller/controller.js');

const express = require('express');
const router = express.Router();

// TODO Swagger API @ router.get('/', methodTBD);

router.get('/osrecords', controller.getAllOSRecords);

router.get('/snmprecords', controller.getAllSNMPRecords);

router.get('/osrecords/oldest/:delimiter', controller.getXoldestOSRecords);

router.get('/osrecords/newest/:delimiter', controller.getXnewestOSRecords);

router.get('/osrecords/cpuusage/:cutoff', controller.getOSRecordsAboveUsage);

router.get('/osjson/dates/:startdate/:enddate', controller.getOSRecordsByDates);

router.delete('/osdata/delete', controller.deleteOSTable);

router.put('/osdata/splice/cutoff', controller.putDeleteXOSRecords);

router.put('/osdata/splice/ids', controller.putDeleteOSMetricsByIds);

router.get('/dbrecords/tablesizes', controller.getTableSizes);

router.get('/dbrecords/tableusage', controller.getTableUsage);

router.get('dbrecords/userlogs', controller.getUserRecords);

module.exports = {
    router
};
