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
		controller : function($scope) {
			$scope.statsLabel = ["Attack Speed", "Damage Rating", "Damage Rating (Physical)", "Damage Rating (Energy)", "Damage Rating (Mental)", "Damage Rating (Melee)", "Damage Rating (Ranged)", "Damage Rating (Area)", "Damage Rating (DoT)", "Summon Damage",
						"Critical Rating", "Critical Rating (Physical)", "Critical Rating (Energy)", "Critical Rating (Mental)", "Critical Rating (Melee)", "Critical Rating (Ranged)", "Critical Rating (Area)", "Critical Damage Rating", "Brutal Rating", "Brutal Damage Rating", 
						"Strength", "Fighting", "Speed", "Energy", "Intelligence", "Tree 1", "Tree 2", "Tree 3"];
			$scope.addStat = function(item) {
				if (item.stats.length < 10) {
					item.stats.push(new Stat("", null))
				}
			};
			$scope.deleteStat = function(item, stat) {
				var index = item.stats.indexOf(stat);
				if (index > -1) {
					item.stats.splice(index, 1)
				}
			};
			$scope.addProc = function(item) {
				if (item.procs.length < 3) {
					item.procs.push(new Proc(null, null))
				}
			};
			$scope.deleteProc = function(item, proc) {
				var index = item.procs.indexOf(proc);
				if (index > -1) {
					item.procs.splice(index, 1)
				}
			};
			$scope.addSkillBonus = function(item) {
				if (item.skillBonuses.length < 3) {
					item.skillBonuses.push(new SkillBonus(null, null))
				}
			};
			$scope.deleteSkillBonus = function(item, skillBonus) {
				var index = item.skillBonuses.indexOf(skillBonus);
				if (index > -1) {
					item.skillBonuses.splice(index, 1)
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
			$scope.getPossibleEnchantments = function(slot) {
				var result = [];
				$scope.enchantments.forEach(function(enchantment) {
					if (enchantment.slots.indexOf(slot) > -1){
						result.push(enchantment);
					}
				});
				return result;
			};
		},
		restrict: 'E',
		replace: 'true',
		templateUrl: 'MHDC_Item.html'
    };
});