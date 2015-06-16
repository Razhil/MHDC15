angular.module('MHDC15App', ['MHDCLib', 'ngAnimate', 'ngRoute'])
.config(['$routeProvider', function($routeProvider, $q) {
	$routeProvider
	.when('/', {
		templateUrl: 'MHDC15.html',
		controller: 'MainCtrl'
	})
	.when('/hero/:hero', {
		templateUrl: 'MHDC15_SW.html',
		controller: 'SWCtrl',
		resolve: {
			heroesBaseStats: function (excelService) {
				return excelService.loadHeroesStats();
			},
			heroesSynergies: function (excelService) {
				return excelService.loadHeroesSynergies();
			}
		}
	})
	.otherwise({redirectTo:'/'});
}])
.controller('MainCtrl', function ($scope) {
	$scope.heroName = "SW";
	$scope.currentUser = "Razhil";
	
	$scope.login = function() {
		if (!$scope.username) {
			alert("Please enter a user name.");		
		} else if ($scope.username.indexOf(" ") > -1) {
			alert("Your user name cannot contain a space or other special characters.")
		} else {
			$scope.currentUser = $scope.username;
		}
	}
	
	$scope.reload = function() {
		$scope.$broadcast('reload');
	}
})
.controller('SWCtrl', function ($scope, heroesBaseStats, heroesSynergies) {
	/* Default view state */
	$scope.showInput = "items";
	$scope.showInfo = "skills";
	
	/* Init model */
	$scope.hero = new Hero("SW");
	
	$scope.test = function() {
		alert('test');
	};
});
