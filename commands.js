// snake case: first_name
// kebab: first-name
// camelCase: firstName
// PascalCase: FirstName

// JSON: new Date("2023-06-01T00:00:00Z").toISOString()
// BSON: new Date("2023-06-01")

// Create the employees collection
db.createCollection('employees')

// Insert a new employee document into the employees collection
// If the collection does not exist, MongoDB will create it automatically
db.employees.insertOne({
    firstName: 'Jane',
    lastName: 'Doe',
    emailAddress: 'jane.doe@deadmail.com',
    yearlySalary: 125000,
    yearsOfExperience: 8,
    hiredAt: new Date('2023-06-01'),
})

db.item.insertOne({
    name: 'Sample Item',
    price: 19.99,
    stockCount: 10,
})

db.item.insertOne({
    name: 'Sample Item 2',
    price: 20.99,
    stockCount: 1,
})

// delete the actual database
db.dropDatabase()

// DROP all non system databases
db.getMongo()
    .getDBNames()
    .forEach((databaseName) => {
        const systemDatabaseNames = ['admin', 'config', 'local']
        if (systemDatabaseNames.indexOf(databaseName) === -1) {
            db.getSiblingDB(databaseName).dropDatabase()
        }
    })

//  import json array of employee documents into the employees collection using the mongoimport command line tool
// mongoimport --db company --collection employees --file /data/import/employees/employees.json --jsonArray

// insert Many

db.employees.insertMany([
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe0@flickr.com',
        gender: 'Male',
        yearlySalary: 200000,
        yearsOfExperience: 15,
        hiredAt: { $date: '2025-02-09T21:26:51.000Z' },
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe0@flickr.com',
        gender: 'Female',
        yearlySalary: 205000,
        yearsOfExperience: 16,
        hiredAt: { $date: '2023-02-09T12:11:00.000Z' },
    },
])

// operator examples
db.employees.countDocuments({
    $and: [
        {
            gender: {
                $eq: 'Female',
            },
        },
        {
            yearsOfExperience: {
                $gte: 50,
            },
        },
    ],
})

// simplified version of the above query
db.employees.countDocuments({
    gender: 'Female',
    yearsOfExperience: { $gte: 50 },
})

// or
// you can use the _ number separator for better readability of large numbers
db.employees.countDocuments({
    $or: [{ yearlySalary: { $gte: 200_000 } }, { yearsOfExperience: { $gte: 50 } }],
})

// $ne - not equal
db.employees.countDocuments({
    gender: { $ne: 'Male' },
})

// $nin - NOT matches any value in the specified array
db.employees.countDocuments({
    gender: { $nin: ['Male', 'Female'] },
})

// DO not use this approach as it is less efficient than the $nin operator
db.employees.countDocuments({
    $and: [{ gender: { $ne: 'Male' } }, { gender: { $ne: 'Female' } }],
})

// This query will not return the expected results because
// the second $ne operator will overwrite the first one, resulting in only the last condition being applied
db.employees.countDocuments({
    gender: { $ne: 'Male' },
    gender: { $ne: 'Female' },
})

db.employees
    .find({
        gender: { $nin: ['Male', 'Female'] },
    })
    .limit(3)

// LIKE: regex
db.employees.find({
    email: { $regex: /@linkedin\.com$/ },
})

// BETWEEEN

db.employees.countDocuments({
    yearlySalary: { $gte: 180_000, $lte: 200_000 },
})

// GROUP BY
// SELECT gender , COUNT(*) AS count
// FROM employees
// GROUP BY gender

// "$gender": group key
// count: {$sum: 1}  - for each document in the group, add 1 to the count field

// new version with $count
db.employees.aggregate([{ $group: { _id: '$gender', count: { $count: {} } } }])

// old version
db.employees.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }, { $match: { count: { $gt: 20 } } }])

// Projekció
// Include only the firstName, lastName and email fields in the result
db.employees.find({ gender: 'Male' }, { firstName: 1, lastName: 1, email: 1 })

// Exclude the firstName, lastName and email fields from the result
db.employees.find({ gender: 'Male' }, { firstName: 0, lastName: 0, email: 0 })

// email field is included only
db.employees.find({}, { email: 1, _id: 0 })

// pagination
db.employees.find().sort({ id: 1 }).limit(10).skip(20)
