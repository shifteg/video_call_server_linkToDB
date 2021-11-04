'use strict';
const PoolManager = require('mysql-connection-pool-manager');
let myhost = 'sql11.freemysqlhosting.net'; // change with localhost   // 185.172.56.11

const options = {
  idleCheckInterval: 1000,
  maxConnextionTimeout: 20000,
  idlePoolTimeout: 3000,
  errorLimit: 50,
  preInitDelay: 50,
  sessionTimeout: 60000,
  mySQLSettings: {
    host: myhost,
    user: 'sql11448702',
    password: 'vl4aMukt9T',
    database: 'sql11448702',
    port: 3306,
    charset: 'utf8mb4',
  },
};
 
const mySQL = PoolManager(options);

module.exports.pool = mySQL;
