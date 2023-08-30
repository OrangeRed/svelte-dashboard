/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "te7rf4yq",
    "name": "field",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 3,
      "values": [
        "investments",
        "transactions",
        "liabilities"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  // remove
  collection.schema.removeField("te7rf4yq")

  return dao.saveCollection(collection)
})
