db = db.getSiblingDB('oneToManyNested')
db.users.drop()

db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['firstName', 'lastName', 'email', 'addresses'],
            properties: {
                firstName: { bsonType: 'string' },
                lastName: { bsonType: 'string' },
                email: { bsonType: 'string', pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' },
                addresses: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        required: ['country', 'zipCode', 'city', 'address'],
                        properties: {
                            country: { bsonType: 'string' },
                            zipCode: { bsonType: 'string' },
                            city: { bsonType: 'string' },
                            address: { bsonType: 'string' },
                        },
                    },
                },
            },
        },
    },
})

db.users.insertMany([
    {
        firstName: 'Anna',
        lastName: 'Kiss',
        email: 'anna.kiss@example.com',
        addresses: [
            {
                country: 'Hungary',
                zipCode: '1111',
                city: 'Budapest',
                address: 'Fő utca 1.',
            },
            {
                country: 'Hungary',
                zipCode: '2222',
                city: 'Debrecen',
                address: 'Kossuth tér 2.',
            },
        ],
    },
    {
        firstName: 'Béla',
        lastName: 'Nagy',
        email: 'bela.nagy@example.com',
        addresses: [
            {
                country: 'Hungary',
                zipCode: '3333',
                city: 'Szeged',
                address: 'Petőfi utca 3.',
            },
        ],
    },
])

printjson(db.users.find().toArray())
