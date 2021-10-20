var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Asset",
    tableName: "asset",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        asset_id: {
            type: "text",
            default: ""
        },
        name: {
            type: "text",
            default: ""
        },
        decimal: {
            type: "int",
            default: ""
        }
    }
});
