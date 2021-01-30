var db = require('./db')
var lib = require('./lib')

module.exports = {
    handle: function(env) {
        switch(env.req.method) {
            // who am I
            case 'GET':
                lib.serveJson(env.res, env.sessionData)
                break
            // login
            case 'POST':
                db.persons.findOne({ email: env.parsedPayload.login }, function(err, result1) {
                    if(err || !result1) {
                        lib.serveError(env.res, 401)
                    } else {
                        db.credentials.findOne({person_id: result1._id }, function(err, result2) {
                            if(err || !result2 || env.parsedPayload.password != result2.password) {
                                lib.serveError(env.res, 401)
                            } else {
                                env.sessionData.login = env.parsedPayload.login
                                env.sessionData.firstName = result1.firstName
                                env.sessionData._id = result1._id
                                env.sessionData.role = result2.role                
                                lib.serveJson(env.res, env.sessionData)
                            }
                        })
                    }
                })
                break
            // logout
            case 'DELETE':
                env.sessionData.login = null
                env.sessionData.firstName = null
                env.sessionData._id = null
                env.sessionData.role = 0
                lib.serveJson(env.res, env.sessionData)
                break
            default:
                lib.serveError(env.res, 405)
        }
    }
}