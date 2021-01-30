var lib = module.exports = {
    serveJson: function(res, obj, code = 200) {
        res.writeHead(code, { contentType: 'application/json' })
        res.write(JSON.stringify(obj))
        res.end()
    },

    serveError: function(res, code) {
        lib.serveJson(res, { error: 'Error occured' }, code)
    }
}