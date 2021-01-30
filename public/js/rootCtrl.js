var app = angular.module('pwsonline')

app.controller('RootCtrl', [ '$http', 'common', function($http, common) {
    console.log('Root controller started')

    var ctrl = this

    ctrl.sessionData = common.sessionData
    ctrl.credentials = { login: '', password: '' }

    ctrl.login = function() {
        $http.post('/login', ctrl.credentials).then(
            function(res) {
                ctrl.sessionData.email = res.data.login
                ctrl.sessionData.firstName = res.data.firstName
                ctrl.sessionData.role = res.data.role
                common.rebuildMenu()
            },
            function(err) {}
        )
    }

    ctrl.logout = function() {
        $http.delete('/login').then(
            function(res) {
                ctrl.sessionData.email = ''
                ctrl.sessionData.firstName = ''
                ctrl.sessionData.role = 0
                common.rebuildMenu()
            },
            function(err) {}
        )
    }
}])