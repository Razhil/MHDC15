angular.module('MHDC15App', ['MHDCLib', 'ngAnimate', 'ngRoute'])
.config(['$routeProvider', function($routeProvider, $q) {
	$routeProvider
	.when('/', {
		templateUrl: 'MHDC15.html',
		controller: 'ErrorCtrl'
	})
	.when('/hero/:heroName', {
		templateUrl: 'MHDC15_SW.html',
		controller: 'SWCtrl',
		resolve: {
			loadHeroStats: function ($route, excelService) {
				return excelService.loadHeroStats($route.current.params.heroName);
			},
			loadHeroSynergies: function (excelService) {
				return excelService.loadHeroSynergies();
			},
			loadHeroSkills: function($route, excelService) {
				return excelService.loadHeroSkills($route.current.params.heroName);
			}
		}
	})
	.otherwise({redirectTo:'/'});
}])
.controller('MainCtrl', function ($scope, $rootScope) {
	$scope.isViewLoading = false;

	$rootScope.$on('$routeChangeStart', function(){
		$scope.isViewLoading = true;
	});
	$rootScope.$on('$routeChangeSuccess', function(){
		$scope.isViewLoading = false;
	});
	$rootScope.$on('$routeChangeError', function() {
		$scope.isViewLoading = false;
	});
})
.controller('SWCtrl', function ($scope, $hero) {
	/* Default view state */
	$scope.showInput = "items";
	$scope.showInfo = "skills";
		
	/* Init model */
	$scope.hero = $hero;
})