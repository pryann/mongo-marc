db = db.getSiblingDB('oneManyToManyLinked')
db.teachers.drop()
db.students.drop()

// teachers kollekció séma
db.createCollection('teachers', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'students'],
            properties: {
                name: { bsonType: 'string' },
                students: {
                    bsonType: 'array',
                    items: { bsonType: 'objectId' },
                },
            },
        },
    },
})

db.createCollection('students', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'teachers'],
            properties: {
                name: { bsonType: 'string' },
                teachers: {
                    bsonType: 'array',
                    items: { bsonType: 'objectId' },
                },
            },
        },
    },
})

// Minta ObjectId-k
const teacherId1 = ObjectId()
const teacherId2 = ObjectId()
const studentId1 = ObjectId()
const studentId2 = ObjectId()
const studentId3 = ObjectId()

db.teachers.insertMany([
    { _id: teacherId1, name: 'Dr. Kovács István', students: [studentId1, studentId2] },
    { _id: teacherId2, name: 'Nagy Mária', students: [studentId2, studentId3] },
])

db.students.insertMany([
    { _id: studentId1, name: 'János Szabó', teachers: [teacherId1] },
    { _id: studentId2, name: 'Éva Kiss', teachers: [teacherId1, teacherId2] },
    { _id: studentId3, name: 'Péter Tóth', teachers: [teacherId2] },
])

print('Tanárok:')
printjson(db.teachers.find().toArray())

print('Diákok:')
printjson(db.students.find().toArray())

print('Tanárok a diákjaikkal (lookup):')
printjson(
    db.teachers
        .aggregate([
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
                    name: 1,
                    studentList: { name: 1 },
                },
            },
        ])
        .toArray(),
)
