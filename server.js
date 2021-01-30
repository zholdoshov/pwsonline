var http = require('http')
var url = require('url')
var static = require('node-static')
var cookies = require('cookies')
var uuid = require('uuid')

var login = require('./login')
var db = require('./db')
var collectionRest = require('./collectionRest')
var transfer = require('./transfer')
const lib = require('./lib')

console.log('PWS Online Project')

var httpServer = http.createServer()
var fileServer = new static.Server('./public')

var sessions = { }
// var sessions = {
//   '3f33b780-1704-4e6b-8f4e-97e28f8c66b4': { ... some data connected with the session},
//   '83aa54b1-423e-4a9a-886b-154f73abc9dd': { ... some data of different session }
// }

httpServer.on('request', function(req, res) {

    var env = {
        req: req,
        res: res
    }

    var now = Date.now()
    var appCookies = new cookies(req, res)
    env.session = appCookies.get('session')
    if(!env.session || !sessions[env.session]) {
        // no session or unknown session
        env.session = uuid.v4()
        sessions[env.session] = { from: req.connection.remoteAddress, created: now, touched: now, login: null, firstName: null, _id: null, role: 0 }
    } else {
        // subsequent request from the same user
        sessions[env.session].touched = now
    }
    appCookies.set('session', env.session, { httpOnly: false })
    env.sessionData = sessions[env.session]

    var payload = ''
    req.on('data', function(data) {
        payload += data
    }).on('end', function() {
        env.parsedUrl = url.parse(req.url, true)
        env.parsedPayload = {}
        try {
            env.parsedPayload = JSON.parse(payload)
        } catch(ex) {}
        console.log(env.sessionData.from, env.session, '(', sessions[env.session].login, ',', sessions[env.session].role, ')', env.req.method, env.req.url, env.parsedPayload)

        env._id = db.makeId(env.parsedUrl.query._id)
         
        switch(env.parsedUrl.pathname) {
            case '/login':
                login.handle(env)
                break
            case '/person':
                if(env.sessionData.role == 1 || (env.req.method == 'GET' && env.sessionData.role == 2))
                    collectionRest.handle(db.persons, env)
                else
                    lib.serveError(env.res, 403)
                break
            case '/transfer':
                transfer.perform(env)
                break
            default:
                fileServer.serve(env.req, env.res)
        }
    })
})

db.init(function() {
    httpServer.listen(8888)
    console.log('HTTP server is starting')
})