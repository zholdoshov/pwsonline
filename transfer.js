var lib = require('./lib')
var db = require('./db')

module.exports = {
    perform: function(env) {
      console.log(env.sessionData);
        if(env.sessionData.role < 1) {
            lib.serveError(env.res, 403)
            return
        }
        switch(env.req.method) {
            case 'GET':
                db.history.aggregate([{$match: {
                    $or: [
                    { sender: env.sessionData._id },
                    { recipient: env.sessionData._id }
                    ]
                  }}, {$set: {
                    amount: { $cond: {
                      if: { $eq: ["$sender",env.sessionData._id] },
                      then: { $multiply: [-1, "$amount"] },
                      else: "$amount"
                    }}
                  }}, {$addFields: {
                    cooperant: { $cond: {
                      if: { $eq: ["$sender",env.sessionData._id] },
                      then: "$recipient",
                      else: "$sender"
                    }}
                  }}, {$project: {
                    sender: false,
                    recipient: false
                  }}, {$lookup: {
                    from: 'persons',
                    localField: 'cooperant',
                    foreignField: '_id',
                    as: 'cooperant_data'
                  }}, {$unwind: {
                    path: "$cooperant_data"
                  }}, {$set: {
                    firstName: "$cooperant_data.firstName",
                    lastName: "$cooperant_data.lastName"
                  }}, {$project: {
                    cooperant: false,
                    cooperant_data: false
                  }}]).toArray(function(err, result) {
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
                      var balanceQ = senderData.balance;
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
                            amount: env.parsedPayload.amount,
                            balance_before: balanceQ,
                            balance_after: balanceQ - env.parsedPayload.amount

                        }
                        db.history.insertOne(operation)
                        lib.serveJson(env.res, operation)
                    })
                })

                break
            default:
                lib.serveError(env.res, 405)
        }
    }
}