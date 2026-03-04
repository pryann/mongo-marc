// 1. feladat – $set
// Módosítsd  id mező alapján az email címet.

db.employees.updateOne({ id: 987 }, { $set: { email: 'garey.winks@nba.com' } })

// 2. feladat – $inc + $currentDate
// Növeld meg minden alkalmazott tapasztalatát (yearsOfExperience) 1-gyel, és állíts be egy lastModified mezőt az aktuális dátumra.

db.employees.updateMany(
    {},
    {
        $inc: { yearsOfExperience: 1 },
        $currentDate: { lastModified: true },
    },
)

// 3. feladat – $mul feltétellel
// Akinek kevesebb mint 10 év tapasztalata van, annak emeld a fizetését 15%-kal.

db.employees.updateMany({ yearsOfExperience: { $lt: 10 } }, { $mul: { yearlySalary: 1.15 } })

// 4. feladat – upsert + findOneAndUpdate
// Keresd meg az id 1 alkalmazottat. Ha nem létezik, hozd létre firstName: "New", lastName: "Hire", yearlySalary: 80000 adatokkal. Ha létezik, frissítsd a fizetését. A frissítés utáni dokumentumot írd ki.
db.employees.findOneAndUpdate(
    { id: 1 },
    { $set: { firstName: 'New', lastName: 'Hire', yearlySalary: 80000 } },
    { upsert: true, returnDocument: 'after' },
)
