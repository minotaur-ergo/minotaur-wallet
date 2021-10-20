const EntitySchema = require("typeorm").EntitySchema;

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
            type: "text",
            default: ""
        },
        value: {
            type: "text",
            default: ""
        }
    }
});
