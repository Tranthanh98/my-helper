import Dexie from "dexie";

Dexie.debug = process.env.NODE_ENV === "development";

const db = new Dexie("data");

db.version(1).stores({
  shopper: "&id,name,phone",
  product: "&id,barcode,categoryId,categoryParentId",
  category: "&id,level,parentId",
  integrationEvent: "++id,type,status",
});

db.version(2).stores({
  saleoutCode: "&date",
});

db.version(3).stores({
  saleoutCode: null,
});

db.version(3.1).stores({
  shopper: "&id,name,phone,debt",
});

export async function cleanUpDbAsync() {
  return Promise.allSettled([
    db.integrationEvent.clear(),
    db.category.clear(),
    db.shopper.clear(),
    db.product.clear(),
  ]);
}

export default db;
