var lib = require('./lib')

module.exports = {

    handle: function(collection, env) {
        switch(env.req.method) {
            case 'GET':
                if(env._id) {
                    collection.findOne({ _id: env._id }, function(err, result) {
                        if(err || !result) {
                            lib.serveError(env.res, 404)
                        } else {
                            lib.serveJson(env.res, result)
                        }
                    })
                } else {
                    collection.find({}).toArray(function(err, result) {
                        if(err) {
                            lib.serveError(env.res, 400)
                        } else {
                            lib.serveJson(env.res, result)
                        }
                    })
                }
                break
            case 'PUT':
                delete env.parsedPayload._id;
                collection.findOneAndUpdate({ _id: env._id }, { $set: env.parsedPayload }, { returnOriginal: false }, function(err, result) {
                    if(err || !result.value) {
                        lib.serveError(env.res, 404)
                    } else {
                        lib.serveJson(env.res, result.value)
                    }
                })
                break
            case 'POST':
                delete env.parsedPayload._id;
                collection.insertOne(env.parsedPayload, function(err, result) {
                    if(err || !result.ops || !result.ops[0]) {
                        lib.serveError(env.res, 400)
                    } else {
                        lib.serveJson(env.res, result.ops[0])
                    }
                })
                break
            case 'DELETE':
                collection.findOneAndDelete({ _id: env._id}, function(err, result) {
                    if(err || !result.value) {
                        lib.serveError(env.res, 404)
                    } else {
                        lib.serveJson(env.res, result.value)
                    }
                })
                break
            default:
                lib.serveError(env.res, 405)
        }
    }
}