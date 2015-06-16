angular.module('MHDC15App')
.controller('SWCtrl', function ($scope) {
	var heroesBaseStats = [];
	//loadHeroesStats();
	var heroesSynergies = [];
	//loadHeroesSynergies();
	var heroesSkills = [];
	
	/* Default view state */
	$scope.showInput = "items";
	$scope.showInfo = "skills";
	
	/* Init model */
	$scope.hero = new Hero("SW");
});
