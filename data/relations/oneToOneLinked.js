db = db.getSiblingDB('oneToOneLinked')
db.users.drop()
db.addresses.drop()

db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['firstName', 'lastName', 'email', 'addressId'],
            properties: {
                firstName: { bsonType: 'string' },
                lastName: { bsonType: 'string' },
                email: { bsonType: 'string', pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' },
                addressId: { bsonType: 'objectId' },
            },
        },
    },
})

// addresses kollekció séma
db.createCollection('addresses', {
    validator: {
        $jsonSchema: {
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
})

const addressId1 = ObjectId()
const addressId2 = ObjectId()

db.addresses.insertMany([
    {
        _id: addressId1,
        country: 'Hungary',
        zipCode: '1111',
        city: 'Budapest',
        address: 'Fő utca 1.',
    },
    {
        _id: addressId2,
        country: 'Hungary',
        zipCode: '2222',
        city: 'Debrecen',
        address: 'Kossuth tér 2.',
    },
])

db.users.insertMany([
    {
        firstName: 'Anna',
        lastName: 'Kiss',
        email: 'anna.kiss@example.com',
        addressId: addressId1,
    },
    {
        firstName: 'Béla',
        lastName: 'Nagy',
        email: 'bela.nagy@example.com',
        addressId: addressId2,
    },
])

print('Felhasználók:')
printjson(db.users.find().toArray())

print('Címek:')
printjson(db.addresses.find().toArray())

// $lookup példa: felhasználók a cím adataival
print('Felhasználók a címekkel (lookup):')
printjson(
    db.users
        .aggregate([
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            { $unwind: '$address' },
        ])
        .toArray(),
)
