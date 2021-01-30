var lib = require('./lib')
var db = require('./db')

module.exports = {
    perform: function(env) {
        if(env.sessionData.role < 1) {
            lib.serveError(env.res, 403)
            return
        }
        switch(env.req.method) {
            case 'GET':
                db.history.find({ who: env._id }).toArray(function(err, result) {
                    if(err) {
                        lib.serveError(env.res, 400)
                    } else {
                        lib.serveJson(env.res, result)
                    }
                })
                break
            case 'POST':
                /*
                    console.log('--- TRANSFER ---')
                    console.log('SENDER:', env.sessionData._id)
                    console.log('RECIPIENT:', env._id)
                    console.log('AMOUNT:', env.parsedPayload.amount)
                */
                if(env.parsedPayload.amount <= 0) {
                    lib.serveError(env.res, 406) // amount is not positive
                    return
                }

                db.persons.findOne({ _id: env._id }, function(err, recipientData) {
                    if(err || !recipientData) {
                        lib.serveError(env.res, 404) // recipient does not exist
                        return
                    }
                    db.persons.findOne({ _id: env.sessionData._id }, function(err, senderData) {
                        if(err || !senderData) {
                            lib.serveError(env.res, 404) // sender does not exist
                            return
                        }
                        if(env.parsedPayload.amount > senderData.balance) {
                            lib.serveError(env.res, 406) // not enough money
                            return
                        }
                        // everything is ok, let's modify database
                        //
                        // decrement of amount of sender
                        db.persons.findOneAndUpdate({ _id: env.sessionData._id },  { $inc: { balance: -env.parsedPayload.amount } })
                        // increment of amount of recipient
                        db.persons.findOneAndUpdate({ _id: env._id },  { $inc: { balance: env.parsedPayload.amount } })
                        // store operation in the history collection
                        var operation = {
                            when: new Date().getTime(),
                            sender: env.sessionData._id,
                            recipient: env._id,
                            amount: env.parsedPayload.amount
                        }
                        db.history.insertOne(operation)
                    })
                })

                break
            default:
                lib.serveError(env.res, 405)
        }
    }
}