var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Address",
    tableName: "address",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "text"
        },
        address: {
            type: "text"
        },
        path: {
            type: "text"
        },
        index: {
            type: "int",
            default: -1
        },
        last_height: {
            type: "int",
            default: 0
        },
        last_update: {
            type: "int",
            default: 0
        },
    },
    relations: {
        wallet: {
            target: "Wallet",
            type: "many-to-one",
            cascade: true,
            joinTable: true,
        }
    },
    uniques: [{
        name: "unique_address",
        columns: ["address"]
    }]
});
