angular.module('MHDC15App', ['MHDCLib', 'ngAnimate', 'ngRoute'])
.config(['$routeProvider', function($routeProvider, $q) {
	$routeProvider
	.when('/', {
		templateUrl: 'MHDC15.html',
		controller: 'MainCtrl'
	})
	.when('/hero/:heroName', {
		templateUrl: 'MHDC15_SW.html',
		controller: 'SWCtrl',
		resolve: {
			heroesBaseStats: function (excelService) {
				return excelService.loadHeroesStats();
			},
			heroesSynergies: function (excelService) {
				return excelService.loadHeroesSynergies();
			},
			heroSkills: function(excelService, $route) {
				return excelService.loadHeroSkills($route.current.params.heroName);
			}
		}
	})
	.otherwise({redirectTo:'/'});
}])
.controller('SWCtrl', function ($scope, CalculationService, heroesBaseStats, heroesSynergies, heroSkills) {
	/* Default view state */
	$scope.showInput = "items";
	$scope.showInfo = "skills";
		
	/* Init model */
	$scope.hero = new Hero("SW");
	$scope.hero.synergies = angular.copy(heroesSynergies);
	$scope.hero.skills = angular.copy(heroSkills);
})
.factory('HeroService', function() {
	var hero;
	return {
		hero: hero;
	};
});
