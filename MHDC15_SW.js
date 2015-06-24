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
.controller('SWCtrl', function ($scope, $hero, excelService) {
	/* Default view state */
	$scope.showInput = "items";
	$scope.showInfo = "skills";
		
	/* Init model */
	$scope.hero = $hero;
	excelService.loadPlayerHero("Razhil");
	
	$scope.skillLvlFilter = function(skill){
		return skill.lvl > 0;
	}
	
	$scope.editItem = function(item) {
		$scope.editingItem = item;
	};
	
	/* TO BE MOVED, there should be a better way of doing labeling */
	$scope.stats = ["AS", "dmgRat", "dmgRat_physical", "dmgRat_energy", "dmgRat_mental", "dmgRat_melee", "dmgRat_ranged", "dmgRat_area", "dmgRat_dot", "dmgRat_summon",
						"critRat", "critRat_physical", "critRat_energy", "critRat_mental", "critRat_melee", "critRat_ranged", "critRat_area", "critDmg", "brutRat", "brutDmg", 
						"strength", "fighting", "speed", "energy", "intelligence", "tree1", "tree2", "tree3", "spirit"];
	var statsLabel = ["Attack Speed", "Damage Rating", "Damage Rat. (Phys.)", "Damage Rat. (Energy)", "Damage Rat. (Mental)", "Damage Rat. (Melee)", "Damage Rat. (Ranged)", "Damage Rat. (Area)", "Damage Rat. (DoT)", "Summon Damage",
						"Critical Rating", "Critical Rat. (Phys.)", "Critical Rat. (Energy)", "Critical Rat. (Mental)", "Critical Rat. (Melee)", "Critical Rat. (Ranged)", "Critical Rat. (Area)", "Critical Damage Rat.", "Brutal Rating", "Brutal Damage Rat.", 
						"Strength", "Fighting", "Speed", "Energy", "Intelligence", "Tree 1", "Tree 2", "Tree 3", "Spirit"];
	$scope.statsLabel = statsLabel;
	
	$scope.getStatLabel = function(stat) {
		var hasPc = (stat.indexOf("_pc") > -1);
		var index = $scope.stats.indexOf(stat.replace("_pc", ""));
		if (index > -1) {
			return (hasPc ? "% " : "") + statsLabel[index];
		} else {
			return stat;
		}
	}
})