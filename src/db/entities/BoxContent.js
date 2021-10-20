var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Config",
    tableName: "config",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            default: ""
        },
        value: {
            type: "varchar",
            default: ""
        }
    }
});
