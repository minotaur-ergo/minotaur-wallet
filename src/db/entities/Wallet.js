var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Wallet",
    tableName: "wallet",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "text"
        },
        mnemonic: {
            type: "text"
        },
        type: {
            type: "text"
        }
    }
});
