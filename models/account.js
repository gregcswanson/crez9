var azure = require('azure')
, uuid = require('node-uuid');

/*
    Partition: Tenant
    RowKey: Email
    
    Edit can only be performed by administrators

*/