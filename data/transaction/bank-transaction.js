// ACID refers to a set of four properties—Atomicity, Consistency, Isolation, and Durability

const session = db.getMongo().startSession()
session.startTransaction()

print('Tranzakció indítása...')

try {
    const accounts = session.getDatabase('bank').accounts

    // Pénz kivétele az egyik számláról
    accounts.updateOne({ _id: 'account1' }, { $inc: { balance: -100 } })

    // Pénz hozzáadása a másik számlához
    accounts.updateOne({ _id: 'account2' }, { $inc: { balance: 100 } })

    // Ha idáig eljutottunk, minden művelet sikeres volt
    session.commitTransaction()
    print('Tranzakció sikeres')
} catch (error) {
    // Hiba esetén minden változtatás visszavonása
    session.abortTransaction()
    print('Tranzakció hiba:', error)
} finally {
    session.endSession()
}

// WIthout JS, not recommended for production, just for demonstration purposes:
// session = db.getMongo().startSession()
// session.startTransaction()
// session.getDatabase('bank').accounts.updateOne({ _id: 'account1' }, { $inc: { balance: -100 } })
// session.getDatabase('bank').accounts.updateOne({ _id: 'account2' }, { $inc: { balance: 100 } })
// session.commitTransaction()
// session.endSession()
