var app = angular.module('pwsonline')

app.controller('TransferCtrl', [ '$http', 'common', function($http, common) {
    console.log('Transfer controller started')
    var ctrl = this

    ctrl.recipients = []
    ctrl.recipient = null

    ctrl.transfer = {
        amount: 0
    }

    ctrl.doTransfer = function() {
        $http.post('/transfer?_id=' + ctrl.recipient._id, ctrl.transfer).then(
            function(res) {
                refreshTransfers()
                common.alert.text = 'Transfer succeded'
                common.alert.style = 'alert-success'
            },
            function(err) {
                common.alert.text = err.data.error
                common.alert.style = 'alert-danger'
            }    
        )
    }

    ctrl.formatDateTime = common.formatDateTime

    var refreshTransfers = function() {
        $http.get('/transfer').then(
            function(res) {
                ctrl.transfers = res.data
            },
            function(err) {
                ctrl.transfers = []
            }
        )
    }

    refreshTransfers()

    $http.get('/person').then(
        function(res) {
            ctrl.recipients = res.data
            ctrl.recipient = ctrl.recipients[0]
        },
        function(err) {
            ctrl.recipients = []
            ctrl.recipient = null
        }
    )
}])