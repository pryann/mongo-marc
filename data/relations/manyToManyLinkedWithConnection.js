db = db.getSiblingDB('oneManyToManyLinkedWithConnection')
db.teachers.drop()
db.students.drop()
db.teacherStudent.drop()

// teachers kollekció séma
db.createCollection('teachers', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email'],
            properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' },
            },
        },
    },
})

// students kollekció séma
db.createCollection('students', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email'],
            properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' },
            },
        },
    },
})

db.createCollection('teacherStudent', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['teacherId', 'studentId'],
            properties: {
                teacherId: { bsonType: 'objectId' },
                studentId: { bsonType: 'objectId' },
            },
        },
    },
})

const teacherId1 = ObjectId()
const teacherId2 = ObjectId()
const studentId1 = ObjectId()
const studentId2 = ObjectId()
const studentId3 = ObjectId()

db.teachers.insertMany([
    { _id: teacherId1, name: 'Dr. Kovács István', email: 'istvan.kovacs@school.hu' },
    { _id: teacherId2, name: 'Nagy Mária', email: 'maria.nagy@school.hu' },
])

db.students.insertMany([
    { _id: studentId1, name: 'János Szabó', email: 'janos.szabo@student.hu' },
    { _id: studentId2, name: 'Éva Kiss', email: 'eva.kiss@student.hu' },
    { _id: studentId3, name: 'Péter Tóth', email: 'peter.toth@student.hu' },
])

db.teacherStudent.insertMany([
    { teacherId: teacherId1, studentId: studentId1 },
    { teacherId: teacherId1, studentId: studentId2 },
    { teacherId: teacherId2, studentId: studentId2 },
    { teacherId: teacherId2, studentId: studentId3 },
])

printjson(db.teacherStudent.find().toArray())

// $lookup példa: minden tanár a hozzá tartozó diákokkal
print('Tanárok a diákjaikkal (lookup):')
printjson(
    db.teachers
        .aggregate([
            {
                $lookup: {
                    from: 'teacher_student',
                    localField: '_id',
                    foreignField: 'teacherId',
                    as: 'connections',
                },
            },
            { $unwind: '$connections' },
            {
                $lookup: {
                    from: 'students',
                    localField: 'connections.studentId',
                    foreignField: '_id',
                    as: 'student',
                },
            },
            { $unwind: '$student' },
            {
                $project: {
                    name: 1,
                    email: 1,
                    'student.name': 1,
                    'student.email': 1,
                },
            },
        ])
        .toArray(),
)
