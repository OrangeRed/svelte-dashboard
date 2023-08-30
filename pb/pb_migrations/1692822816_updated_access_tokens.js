/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yumevyaw",
    "name": "products",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  // remove
  collection.schema.removeField("yumevyaw")

  return dao.saveCollection(collection)
})
