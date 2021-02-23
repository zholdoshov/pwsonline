var app = angular.module('pwsonline', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap' ])

app.constant('routes', [
    { route: '/', templateUrl: 'rootView.html', controller: 'RootCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
    { route: '/example', templateUrl: 'exampleView.html', controller: 'ExampleCtrl', controllerAs: 'ctrl', menu: 'Example', role: -1 },
    { route: '/bank', templateUrl: 'bankView.html', controller: 'BankCtrl', controllerAs: 'ctrl', menu: 'Bank', role: 1 },
    { route: '/transfer', templateUrl: 'transferView.html', controller: 'TransferCtrl', controllerAs: 'ctrl', menu: 'Transfer', role: 2 }
])

app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i])
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

app.controller('MainCtrl',  [ '$scope', '$location', '$http', 'routes', 'common', function($scope, $location, $http, routes, common) {
    console.log('Main controller started')

    var ctrl = this

    ctrl.alert = common.alert
    ctrl.message = common.message
    ctrl.menu = common.menu

    $http.get('/login').then(
        function(res) {
            common.sessionData.email = res.data.login
            common.sessionData.firstName = res.data.firstName
            common.sessionData.role = res.data.role
            common.rebuildMenu()
        },
        function(err) {}
    )

    // controlling collapsed/not collapsed status
    ctrl.isCollapsed = true
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true
    })

    // determining which menu position is active
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : ''
    }

    ctrl.closeAlert = function() {
        ctrl.alert.text = ''
    }
    
}])

app.service('common', [ '$http', '$location', 'routes', function($http, $location, routes) {
    console.log('Service common started')
    
    var common = this

    common.alert = { text: '', type: 'alert-success' }
    common.message = { style: '', text: ''}
    common.menu = []

    common.sessionData = {
        email: '',
        firstName: '',
        role: 0
    }

    common.rebuildMenu = function() {
        common.menu.length = 0
        for(var i in routes) {
            if(!routes[i].role || common.sessionData.role == routes[i].role) {
                common.menu.push({route: routes[i].route, title: routes[i].menu});
            }
        }
        $location.path('/');
    }    

    common.formatDateTime = function(stamp) {
        var date = new Date(stamp)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

}])