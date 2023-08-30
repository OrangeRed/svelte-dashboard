/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "27rgknhewqlh278",
    "created": "2023-08-02 12:30:10.250Z",
    "updated": "2023-08-02 12:30:10.250Z",
    "name": "access_tokens",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "c5k0fvry",
        "name": "access_token",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dhjerug7",
        "name": "institution_id",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "f1kuooot",
        "name": "institution_name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("27rgknhewqlh278");

  return dao.deleteCollection(collection);
})
