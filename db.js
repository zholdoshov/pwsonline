var mongodb = require('mongodb')

var db = module.exports = {

    persons: null,
    history: null,
    credentials: null,

    makeId: function(idStr) {
        if(idStr) {
            try {
                return mongodb.ObjectID(idStr)
            } catch {
                return mongodb.ObjectID('000000000000000000000000')
            }
        }
    },

    init: function(nextTick) {
        mongodb.MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true }, function(err, conn) {
            if(err) {
                console.error('Connection to database failed')
            } else {
                console.log('Connection to database established')
                var database = conn.db('pwsonline')
                db.persons = database.collection('persons')
                db.history = database.collection('history')
                db.credentials = database.collection('credentials')
                nextTick()
            }
        })
    }
}