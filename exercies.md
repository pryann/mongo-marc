# MongoDB Gyakorlatok

---

## 1. feladat
**Keresd meg azokat az alkalmazottakat, akiknek az éves fizetése 150 000 és 200 000 között van, és rendezd őket fizetés szerint csökkenő sorrendben. Csak a `firstName`, `lastName` és `yearlySalary` mezőket jelenítsd meg (_id nélkül).**

```js
// Éves fizetés 150 000 és 200 000 között, csökkenő sorrendben
// Csak firstName, lastName, yearlySalary mezők (_id nélkül)
db.employees.find(
  { yearlySalary: { $gte: 150_000, $lte: 200_000 } },
  { firstName: 1, lastName: 1, yearlySalary: 1, _id: 0 }
).sort({ yearlySalary: -1 })
```

---

## 2. feladat
**Hány darab alkalmazott van, akinek az email címe `.com`-ra végződik, de NEM `flickr.com`-ra?**

```js
// .com-ra végződő, de nem flickr.com email
// Count dokumentumok
// Megjegyzés: A $not operátor regex-nél nem támogatott, helyette $and javasolt
// Alternatív megoldás:
db.employees.countDocuments({
  email: { $regex: /\.com$/, $not: /flickr\.com$/ }
})
```

---

## 3. feladat
**Listázd ki nemenként (`gender`) az átlagfizetést (`avgSalary`) és a létszámot (`count`). Csak azokat a csoportokat jelenítsd meg, ahol a létszám nagyobb mint 10.**

```js
// Átlagfizetés és létszám nemenként, csak ahol count > 10
db.employees.aggregate([
  { $group: { _id: "$gender", avgSalary: { $avg: "$yearlySalary" }, count: { $sum: 1 } } },
  { $match: { count: { $gt: 10 } } }
])
```

---

## 4. feladat
**Keresd meg a 3 legkevesebb tapasztalattal rendelkező (`yearsOfExperience`) női (`Female`) alkalmazottat. Jelenítsd meg a nevüket és tapasztalatukat.**

```js
// 3 legkevesebb tapasztalattal rendelkező női alkalmazott
db.employees.find(
  { gender: "Female" },
  { firstName: 1, lastName: 1, yearsOfExperience: 1, _id: 0 }
).sort({ yearsOfExperience: 1 }).limit(3)
```

---

## 5. feladat
**Keresd meg azokat az alkalmazottakat, akiket 2025 januárjában vettek fel (`hiredAt` mező 2025-01-01 és 2025-01-31 között van), VAGY akiknek a neme sem nem `Male`, sem nem `Female`. Rendezd felvételi dátum szerint növekvő sorrendben.**

```js
// 2025 januárban felvettek VAGY nem Male/Female neműek
db.employees.find({
  $or: [
    { hiredAt: { $gte: new Date("2025-01-01"), $lte: new Date("2025-01-31") } },
    { gender: { $nin: ["Male", "Female"] } }
  ]
}).sort({ hiredAt: 1 })
```
