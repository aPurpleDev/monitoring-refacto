//SNMP Metrics handlers, for now IP target hard-coded TODO design to get IP of current client + flag clients by MAC Addresses
const snmp = require('net-snmp');
const session = snmp.createSession('192.168.10.148', 'public');
const oids = ['1.3.6.1.4.1.2021.4.5.0'];
const freeRAMoids = ['1.3.6.1.4.1.2021.4.11.0'];

//Probe client device for SNMP Metrics
const probeSNMP = () => {
    let totalRam;
    session.get(oids, (e, varbinds) => {
        if (e) {
            console.log(e);
        } else {
            for (let i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]))
                } else {
                    totalRam = varbinds[i].value;
                }
            }
        }
    });

    let freeRam;
    session.get(freeRAMoids, (e, varbinds) => { //supposed to be freeRam OID data
        if (e) {
            console.log(e);
        } else {
            for (let i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]))
                } else {
                    freeRam = varbinds[i].value;
                    return {freeRam, totalRam};
                }
            }
        }
    })
};

//Error-handling of snmp librairy features
session.trap(snmp.TrapType.LinkDown, (error) => {
    if (error)
        console.log(error);
});

module.exports = {
    probeSNMP
};
