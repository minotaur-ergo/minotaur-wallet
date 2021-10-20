var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Transaction",
    tableName: "transaction",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        tx_id: {
            type: "text",
            default: ""
        },
        height: {
            type: "int",
            default: 0
        },
        date: {
            type: "int",
            default: 0
        },
        json: {
            type: "text"
        }
    }
});
