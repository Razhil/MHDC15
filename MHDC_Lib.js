angular.module('MHDCLib', [])
.directive('itemBox', function() {
    return {
	    scope: {
			item: '=',
			readonly: '=',
			stats: '=',
			skills: '=',
			enchantments: '='
		},
		restrict: 'A',
		replace: 'true',
		controller : function($scope, $hero, $items) {
			$scope.statsLabel = ["Attack Speed", "Damage Rating", "Damage Rat. (Phys.)", "Damage Rat. (Energy)", "Damage Rat. (Mental)", "Damage Rat. (Melee)", "Damage Rat. (Ranged)", "Damage Rat. (Area)", "Damage Rat. (DoT)", "Summon Damage",
						"Critical Rating", "Critical Rat. (Phys.)", "Critical Rat. (Energy)", "Critical Rat. (Mental)", "Critical Rat. (Melee)", "Critical Rat. (Ranged)", "Critical Rat. (Area)", "Critical Damage Rat.", "Brutal Rating", "Brutal Damage Rat.", 
						"Strength", "Fighting", "Speed", "Energy", "Intelligence", "Tree 1", "Tree 2", "Tree 3", "Spirit"];
			$scope.addStat = function(item) {
				if (item.stats.length < 10) {
					item.addStat("", null);
				}
			};
			$scope.deleteStat = function(item, stat) {
				var index = item.stats.indexOf(stat);
				if (index > -1) {
					item.stats.splice(index, 1);
				}
			};
			$scope.addProc = function(item) {
				if (item.procs.length < 3) {
					item.addProc(null, null);
				}
			};
			$scope.deleteProc = function(item, proc) {
				var index = item.procs.indexOf(proc);
				if (index > -1) {
					item.procs.splice(index, 1);
				}
			};
			$scope.addSkillBonus = function(item) {
				if (item.skillBonuses.length < 3) {
					item.addSkillBonus(null, null);
				}
			};
			$scope.deleteSkillBonus = function(item, skillBonus) {
				var index = item.skillBonuses.indexOf(skillBonus);
				if (index > -1) {
					item.skillBonuses.splice(index, 1);
				}
			};
			$scope.getStatLabel = function(stat) {
				var index = $scope.stats.indexOf(stat);
				if (index > -1) {
					return $scope.statsLabel[index];
				} else {
					return stat;
				}
			};
			
			$scope.recalculate = function() {
				$hero.calculate();
			}
			
			$scope.getItems = function() {
				return $items.getRelics();
			}
			
			$scope.chooseItem = function() {
				$scope.item.name = $scope.itemChosen.name;
				$scope.item.stats = [];
				$scope.itemChosen.stats.forEach(function(stat) {
					$scope.item.addStat(stat.name, stat.value);
				});
				$scope.recalculate();
			}
		},
		templateUrl: 'MHDC_Item.html'
    };
});