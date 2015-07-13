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
			loadHeroSkills: function($route, dataService) {
				return dataService.loadHeroSkills($route.current.params.heroName);
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
	
	$scope.calcTTK = function(dummyHP) {
		var currentTime = 0;
		var nextAction = 0;
		var totalDamage = 0;
		var currentEffects = [];
		//var castingOrder = "";
		
		while (currentTime < 10 && totalDamage < dummyHP) {
			var prio = 1;
			var didSomething = false;
			
			if (nextAction <= currentTime) {
				while (prio <= 10 && didSomething == false) {
					var skill = $scope.hero.getSkillByPrio(prio);
					if (skill && (!(skill.name in currentEffects)  || currentEffects[skill.name].time <= currentTime)) {
						if (skill.name in currentEffects) {
							currentEffects[skill.name] = null;
						}
						skill.getActiveEffects().forEach(function(activeEffect) {
							if (activeEffect.isDot()) {
								var skillDuration = 3;
								var as = 0.5;
								
								currentEffects[skill.name] = {time:currentTime+skillDuration, effect:activeEffect};
								nextAction = currentTime + as;
							} else {
								var damage = activeEffect.dps()/activeEffect.AS();
								totalDamage += damage;
								//console.log("Hit " + damage + " dmg at " + currentTime + " sec.");
								nextAction = currentTime + 1/activeEffect.AS();
							}
						});
						//castingOrder += skill.name+" ("+currentTime+") "+"\r\n"
						didSomething = true;
					} else {
						prio++;
					}
				}
				if (!didSomething) {
					if (Object.keys(currentEffects).length > 0) {
						var lowest = null;
						Object.keys(currentEffects).forEach(function(key) {
							if (!lowest || currentEffects[key].time < lowest) {
								lowest = currentEffects[key].time;
							}
						});
						nextAction = lowest;
					} else {
						break;
					}
				}
			}
			
			if (currentTime % 0.5 == 0) {
				Object.keys(currentEffects).forEach(function(key) {
					var dot = currentEffects[key].effect;
					var damage = dot.dps()/dot.AS();
					totalDamage += damage;
					//console.log("Tick " + damage + " dmg at " + currentTime + " sec.");
				});
			}
			
			currentTime = (currentTime * 100 + 1) /100;
		}
		//return castingOrder + " || " + totalDamage + " damage in 10 ";
		
		if (totalDamage < dummyHP) {
			return "more than 10 seconds";
		} else {
			return Math.round(currentTime*100)/100 + " seconds";
		}
	}
})