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

// deleteOne
db.employees.deleteOne({ _id: ObjectId('69a6d35b39e2719d91f1d0dc') })

// deleteMany
// delete all employees, but keep the collection and its indexes
db.employees.deleteMany({})

// deleteMany with filter: delete all employees with less than 10 years of experience
db.employees.deleteMany({ yearsOfExperience: { $lt: 10 } })

// drop the collection
db.employees.drop()

// UPDATE
// $inc – numerikus mező növelése/csökkentése adott értékkel
// $mul – numerikus mező szorzása adott értékkel
// $min – csak akkor állítja be az értéket, ha az új érték kisebb, mint a jelenlegi
// $max – csak akkor állítja be az értéket, ha az új érték nagyobb, mint a jelenlegi
// $currentDate – mező értékének aktuális dátumra/időre állítása

// updateOne
db.employees.updateOne(
    { _id: ObjectId('69a6d35b39e2719d91f1d0a9') },
    {
        $set: {
            email: 'UPDATED_EMAIL_ADDRESS@DOMAIN.COM',
        },
    },
)

// ellenőrzés
db.employees.findOne({ _id: ObjectId('69a6d35b39e2719d91f1d0a9') })

// updateMany
// increment the yearlySalary field by 5% for all employees
db.employees.updateMany(
    {},
    {
        $mul: { yearlySalary: 1.05 },
    },
)
// updateMany
// increment the yearlySalary field by 5%, where the employee salary less than 180000
db.employees.updateMany({ yearlySalary: { $lt: 180_000 } }, { $mul: { yearlySalary: 1.05 } })

// upsert
// MERGE INTO employees e
// USING (SELECT 101 AS emp_id, 'Uzumaki Naruto' AS name, 5000 AS salary FROM dual) s
// ON (e.emp_id = s.emp_id)
// WHEN MATCHED THEN
//     UPDATE SET e.salary = s.salary
// WHEN NOT MATCHED THEN
//     INSERT (emp_id, name, salary) VALUES (s.emp_id, s.name, s.salary);

db.employees.updateOne(
    { _id: ObjectId('69a6d35b39e2719d91f1d0a1') },
    { $set: { firstName: 'Uzumaki', lastName: 'Naruto', yearlySalary: 5000 } },
    { upsert: true },
)

// min - only update the yearlySalary field if the new value is less than the current value
db.employees.updateOne({ _id: ObjectId('69a6d35b39e2719d91f1d0a1') }, { $min: { yearlySalary: 5000 } })

// max - only update the yearlySalary field if the new value is greater than the current value
db.employees.updateOne({ _id: ObjectId('69a6d35b39e2719d91f1d0a1') }, { $max: { yearlySalary: 5000 } })

// $currentDate - set the field to the current date
db.employees.updateOne({ _id: ObjectId('69a6d35b39e2719d91f1d0a1') }, { $currentDate: { hiredAt: true } })

// findOneAndUpdate - return the document

db.employees.findOneAndUpdate(
    { _id: ObjectId('69a6d35b39e2719d91f1d0a1') },
    { $set: { email: 'uzumaki.naruto@domain.jp' } },
    { projection: { firstName: 1, lastName: 1, email: 1, _id: 0 }, returnDocument: 'after' },
    { returnDocument: 'after' },
)

// MODIFY FIELDS
// $rename - rename a field
db.employees.updateMany({}, { $rename: { yearlySalary: 'annualSalary' } })

// $unset - remove a field from the document
db.employees.updateMany({}, { $unset: { gender: '' } })

db.employees.find().forEach((doc) => {
    db.employees.updateOne({ _id: doc._id }, { $set: { annualSalary: NumberDecimal(doc.annualSalary) } })
})

// VALIDATON
// it is not a real life regex for email validation, but it is just for demonstration purposes
db.createCollection('employees', {
    validator: {
        $jsonSchema: {
            type: 'object',
            required: ['id', 'email'],
            additionalProperties: false,
            properties: {
                id: {
                    bsonType: 'int',
                    description: 'must be an integer and is required',
                },
                email: {
                    bsonType: 'string',
                    pattern: '^[a-z0-9_]+@[a-z0-9]+\\.[a-z]{2,}$',
                    description: 'must be a string and match the email pattern',
                },
                firstName: {
                    bsonType: 'string',
                    description: 'must be a string',
                },
                lastName: {
                    bsonType: 'string',
                    description: 'must be a string',
                },
                yearlySalary: {
                    bsonType: 'int',
                    description: 'must be an integer',
                },
                yearsOfExperience: {
                    bsonType: 'int',
                    description: 'must be an integer',
                },
                hiredAt: {
                    bsonType: 'date',
                    description: 'must be a date',
                },
            },
        },
    },
})

// overwrite validator
db.runCommand({
    collMod: 'employees',
    validator: {
        $jsonSchema: {
            type: 'object',
            required: ['id', 'email'],
            additionalProperties: false,
            properties: {
                _id: {},
                id: {
                    bsonType: 'int',
                    description: 'must be an integer and is required',
                },
                email: {
                    bsonType: 'string',
                    pattern: '^[a-z0-9_]+@[a-z0-9]+\\.[a-z]{2,}$',
                    description: 'must be a string and match the email pattern',
                },
                firstName: {
                    bsonType: 'string',
                    description: 'must be a string',
                },
                lastName: {
                    bsonType: 'string',
                    description: 'must be a string',
                },
                yearlySalary: {
                    bsonType: 'int',
                    description: 'must be an integer',
                },
                yearsOfExperience: {
                    bsonType: 'int',
                    description: 'must be an integer',
                },
                hiredAt: {
                    bsonType: 'date',
                    description: 'must be a date',
                },
            },
        },
    },
    validationAction: 'warn',
})

// delete validator
db.runCommand({
    collMod: 'employees',
    validator: {},
})

// $sum

db.employees.aggregate([
    {
        $group: {
            _id: null,
            totalAnnualSalaryExpense: {
                $sum: '$yearlySalary',
            },
        },
    },
    {
        $project: {
            _id: 0,
            totalAnnualSalaryExpense: 1,
        },
    },
])

// $avg
db.employees.aggregate([
    {
        $group: {
            _id: null,
            averageAnnualSalary: {
                $avg: '$yearlySalary',
            },
        },
    },
    {
        $project: {
            _id: 0,
            averageAnnualSalary: 1,
        },
    },
])

// $min $max

db.employees.aggregate([
    {
        $group: {
            _id: null,
            minimumSalary: {
                $min: '$yearlySalary',
            },
            maximumSalary: {
                $max: '$yearlySalary',
            },
        },
    },
    {
        $project: {
            _id: 0,
            minimumSalary: 1,
            maximumSalary: 1,
        },
    },
])

// $first, $last, $sort

db.employees.aggregate([
    {
        $sort: {
            hiredAt: 1,
        },
    },
    {
        $group: {
            _id: '$gender',
            firstHired: { $first: '$firstName' },
            lastHired: { $last: '$firstName' },
        },
    },
])

// $addToSet

db.employees.aggregate([
    {
        $group: {
            _id: null,
            uniqueGenders: { $addToSet: '$gender' },
        },
    },
    {
        $project: {
            _id: 0,
            uniqueGenders: 1,
        },
    },
])

db.employees.aggregate([
    { $sort: { yearlySalary: -1 } },
    { $skip: 10 },
    { $limit: 5 },
    { $project: { email: 1, yearlySalary: 1, _id: 0 } },
])

// Load
load('/data/import/relations/oneToOneNested.js')
db.users.insertOne({
    firstName: 'Lajos',
    lastName: 'Kiss',
    address: {
        country: 'Hungary',
        zipCode: '1111',
        city: 'Budapest',
        address: 'Fő utca 1.',
    },
})

db.students.aggregate([
    {
        $lookup: {
            from: 'teachers',
            localField: 'teachers',
            foreignField: '_id',
            as: 'teacherList',
        },
    },
    {
        $project: {
            name: 1,
            teacherList: { name: 1 },
        },
    },
])

// FULL JOIN
db.teachers.aggregate([
    // Tanárok → diákok irány
    {
        $lookup: {
            from: 'students',
            localField: 'students',
            foreignField: '_id',
            as: 'studentList',
        },
    },
    {
        $project: {
            type: { $literal: 'teacher' },
            name: 1,
            related: '$studentList.name',
        },
    },
    // UNION: Diákok → tanárok irány
    {
        $unionWith: {
            coll: 'students',
            pipeline: [
                {
                    $lookup: {
                        from: 'teachers',
                        localField: 'teachers',
                        foreignField: '_id',
                        as: 'teacherList',
                    },
                },
                {
                    $project: {
                        type: { $literal: 'student' },
                        name: 1,
                        related: '$teacherList.name',
                    },
                },
            ],
        },
    },
])

// create indexes
db.employees.createIndex({ email: 1 }, { unique: true, name: 'email_unique_idx' })

db.employees.createIndex({ lastName: 1, firstName: 1 }, { name: 'name_idx' })

// find with index, and check the execution plan to see if the index is used
db.employees.find({ email: 'omarringtonk@salon.com' }).explain('executionStats')

// list indexes
db.employees.getIndexes()

// drop index by name
db.employees.dropIndex('email_unique_idx')

// drop all indexes
db.employees.dropIndexes()

// USER MANAGEMENT

// create a new user with readWrite role on the company database, read role on the oneToManyLinked database and dbAdmin role on the users database
db.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: [
        { role: 'readWrite', db: 'company' },
        { role: 'dbAdmin', db: 'users' },
        { role: 'read', db: 'oneToManyLinked' },
    ],
})

// update user roles: add read role on the oneToOneNested database
db.grantRolesToUser('app_user', [{ role: 'read', db: 'oneToOneNested' }])

// update user roles: remove read role on the oneToManyLinked database
db.revokeRolesFromUser('app_user', [{ role: 'read', db: 'oneToOneNested' }])

// change user password
db.updateUser('app_user', { pwd: 'password' })

// authenticate as the app_user
db.getUser('app_user')

// authenticate with the new password
db.getUsers()

// check the current connection status to see the authenticated user and its roles
db.runCommand({ connectionStatus: 1 })

// drop the user
db.dropUser('app_user')

// authenticate with the admin user
// mongosh -u admin -p admin_password --authenticationDatabase admin

// mongosh "mongodb://username:password@localhost:27017/databaseName?authSource=admin"

// if inside mongosh
db.auth('username', 'password   ')

// EXPORT/IMPORT

// import: see above with mongoimport command

// mongoexport --db company --collection employees --out /data/export/employees.json --jsonArray
// mongoexport --db company --collection employees --type=csv --fields firstName,lastName,email --out /data/export/employees.csv

// BACKUP/RESTORE
// ONLY ONE DB
// mongodump --db company --out /data/backup/company_backup

// ALL DBs
// mongodump --out /data/backup/full_backup

// restore a single database
// mongorestore --db company /data/backup/company_backup
// mongorestore ./data/backup/full_backup
