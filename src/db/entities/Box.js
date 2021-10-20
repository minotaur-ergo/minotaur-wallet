var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Box",
    tableName: "box",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        box_id: {
            type: "text",
            nullable: false,
        },
        spend_tx_id: {
            type: "text",
            nullable: true
        },
        erg: {
            type: "int",
            default: 0
        },
        nano_erg: {
            type: "int",
            default: 0
        },
        creation_index: {
            type: "int",
            default: 0
        },
        spend_index: {
            type: "int",
            nullable: true
        },
        json: {
            type: "text",
            nullable: false
        }
    },
    relations: {
        tx_id: {
            target: "Transaction",
            type: "many-to-one",
            cascade: true
        },
        spend_tx_id: {
            target: "Transaction",
            type: "many-to-one",
            cascade: true
        },
        address: {
            target: "Address",
            type: "many-to-one",
            cascade: true
        }
    }
});
