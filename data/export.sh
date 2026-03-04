DB="company"
OUT="/data/export"

for col in $(mongosh --quiet --eval "db.getSiblingDB('$DB').getCollectionNames().join('\n')")
do
  mongoexport --db $DB --collection $col --out "$OUT/$col.json" --jsonArray 
done