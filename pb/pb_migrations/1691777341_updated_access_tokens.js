/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jpxcqwbk",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jpxcqwbk",
    "name": "products",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
