db = db.getSiblingDB('bank')
db.accounts.drop()

db.createCollection('accounts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'balance'],
            properties: {
                _id: { bsonType: 'string' },
                balance: { bsonType: 'number' },
            },
        },
    },
})

// Minta adatok
db.accounts.insertMany([
    { _id: 'account1', balance: 1000 },
    { _id: 'account2', balance: 500 },
])
