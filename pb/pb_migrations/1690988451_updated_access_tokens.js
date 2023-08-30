/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  collection.indexes = [
    "CREATE INDEX `idx_58Sllkk` ON `access_tokens` (`access_token`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278")

  collection.indexes = []

  return dao.saveCollection(collection)
})
