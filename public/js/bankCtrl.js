var app = angular.module('pwsonline')

app.controller('BankCtrl', [ '$http', 'common', function($http, common) {
    console.log('Bank controller started')
    var ctrl = this

    ctrl.selectedIndex = -1

    ctrl.singlePerson = {
        firstName: '',
        lastName: '',
        year: 0,
        email: '',
        balance: 0
    }

    $http.get('/person').then(
        function(res) {
            ctrl.person = res.data
        },
        function(err) {}
    )
   
    ctrl.update = function() {
        $http.put('/person?_id=' + ctrl.person[ctrl.selectedIndex]._id, ctrl.singlePerson).then(
            function(res) {
                ctrl.person[ctrl.selectedIndex] = res.data
            },
            function(err) {}    
        )
    }

    ctrl.insert = function() {
        ctrl.singlePerson.balance = 0
        $http.post('/person', ctrl.singlePerson).then(
            function(res) {
                ctrl.person.push(res.data)
                ctrl.selectedIndex = -1
            },
            function(err) {}    
        )
    }

    var refreshTransfers = function(index) {
        $http.get('/transfer?_id=' + ctrl.person[index]._id).then(
            function(res) {
                ctrl.transfers = res.data
            },
            function(err) {
                ctrl.transfers = []
            }
        )
    }

    ctrl.select = function(index) {
        $http.get('/person?_id=' + ctrl.person[index]._id).then(
            function(res) {
                ctrl.selectedIndex = index
                ctrl.singlePerson = res.data
                refreshTransfers(index)
            },
            function(err) {}
        )
    }

    ctrl.delete = function() {
        $http.delete('/person?_id=' + ctrl.person[ctrl.selectedIndex]._id).then(
            function(res) {
                ctrl.person.splice(ctrl.selectedIndex, 1);
                ctrl.selectedIndex = -1
            },
            function(err) {}
        )
    }

    ctrl.formatDateTime = common.formatDateTime

}])