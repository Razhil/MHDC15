angular.module('MHDC15App')
.factory('CalculationService', function() {
	var getTotalLvl = function(skill, hero) {
		return (skill.lvl > 0 ? skill.lvl + hero.getStatFromItems(skill.tree) + hero.getSkillBonus(skill) : 0);
	}
	
	return {
		getTotalLvl : getTotalLvl
	}
})
.controller('DetailsCalculatorCtrl', function ($rootScope, $scope, $http, $q) {
	/* INIT */
	$scope.Math = window.Math;
	$scope.stats = ["AS", "dmgRat", "dmgRat_physical", "dmgRat_energy", "dmgRat_mental", "dmgRat_melee", "dmgRat_ranged", "dmgRat_area", "dmgRat_dot", "dmgRat_summon_pc",
						"critRat", "critRat_physical", "critRat_energy", "critRat_mental", "critRat_melee", "critRat_ranged", "critRat_area", "critDmg", "brutRat", "brutDmg", 
						"strength", "fighting", "speed", "energy", "intelligence", "tree1", "tree2", "tree3", "spirit"];
	var statsLabel = ["Attack Speed", "Damage Rating", "Damage Rat. (Phys.)", "Damage Rat. (Energy)", "Damage Rat. (Mental)", "Damage Rat. (Melee)", "Damage Rat. (Ranged)", "Damage Rat. (Area)", "Damage Rat. (DoT)", "Summon Damage",
						"Critical Rating", "Critical Rat. (Phys.)", "Critical Rat. (Energy)", "Critical Rat. (Mental)", "Critical Rat. (Melee)", "Critical Rat. (Ranged)", "Critical Rat. (Area)", "Critical Damage Rat.", "Brutal Rating", "Brutal Damage Rat.", 
						"Strength", "Fighting", "Speed", "Energy", "Intelligence", "Tree 1", "Tree 2", "Tree 3", "Spirit"];
	$scope.statsLabel = statsLabel;
	
	$scope.getStatLabel = function(stat) {
		var index = $scope.stats.indexOf(stat);
		if (index > -1) {
			return statsLabel[index];
		} else {
			return stat;
		}
	}
	
	$scope.initEnchantments = function() {
		var enchantments = [];
		
		/* Blessings (Artifacts) */
		var enchantment = new Enchantment("Odin", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("Loki", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("Frigga", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("SIF", ["Art1", "Art2", "Art3", "Art4"]);
		enchantment.stats.push(new Stat("AS", 2));
		enchantments.push(enchantment);
		enchantment = new Enchantment("Balder", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("Heimdall", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("Fandral", ["Art1", "Art2", "Art3", "Art4"]);
		enchantment.stats.push(new Stat("critRat", 100));
		enchantments.push(enchantment);
		enchantment = new Enchantment("Hogun", ["Art1", "Art2", "Art3", "Art4"]);
		enchantment.stats.push(new Stat("dmgRat_melee_pc", 3));
		enchantments.push(enchantment);
		enchantment = new Enchantment("Volstagg", ["Art1", "Art2", "Art3", "Art4"]);
		enchantments.push(enchantment);
		enchantment = new Enchantment("Hela", ["Art1", "Art2", "Art3", "Art4"]);
		enchantment.stats.push(new Stat("brutRat_pc", 5));
		enchantments.push(enchantment);
		
		/* Small enchants (Slot 1-5) */
		enchantment = new Enchantment("+ Dmg Physical", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_physical", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Dmg Energy", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_energy", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Dmg Mental", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_mental", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Dmg Melee", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_melee", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Dmg Ranged", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_ranged", 50));
		enchantments.push(enchantment);	
		enchantment = new Enchantment("+ Dmg Area", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("dmgRat_area", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Critical Rating", ["Slot1", "Slot5"]);
		enchantment.stats.push(new Stat("critRat", 50));
		enchantments.push(enchantment);
		enchantment = new Enchantment("+ Spirit", ["Slot2", "Slot3", "Slot4"]);
		enchantment.stats.push(new Stat("spirit", 20));
		enchantments.push(enchantment);
		
		$scope.enchantments = enchantments;
	
	}
	
	var findEnchantment = function(name) {
		var result = null;
		enchantments.forEach(function(enchantment) {
			if (enchantment.name == name) {
				result = enchantment;
			}
		});
		return result;
	}
	
	var resetProfile = function() {
		if ($scope.heroName && $scope.state == "Advanced") {
			$scope.showInput = "items";
			$scope.showInfo = "skills";

			var hero = initHero();
			$scope.hero = hero;
			if ($scope.currentUser) {
				loadHeroFromDB();
			}
		} else {
			$scope.hero = null;
		}
	};
	
	$scope.$on('reload', function(event, mass) {
		resetProfile();
	});
	
	$scope.$watch('heroName', function() {
		resetProfile();
	});
	
	$scope.$watch('state', function() {
		resetProfile();
	});
	
	var initHero = function () {
		if ($scope.editingItem) {
			$scope.closeCompare();
		}
		var heroName = $scope.heroName;
		var stats = $rootScope.getHeroBaseStats(heroName);
		
		var hero = new Hero(stats.name);
		hero.baseStats.durability = stats.durability;
		hero.baseStats.strength = stats.strength;
		hero.baseStats.fighting = stats.fighting;
		hero.baseStats.speed = stats.speed;
		hero.baseStats.energy = stats.energy;
		hero.baseStats.intelligence = stats.intelligence;
		hero.baseStats.dmgRat = (stats.dmgRat ? stats.dmgRat : 0);
		hero.baseStats.dmgRat_melee = (stats.dmgRat_melee ? stats.dmgRat_melee : 0);
		
		hero.synergies = angular.copy($rootScope.getHeroesSynergies());

		$rootScope.initSkills(hero, heroName);
		
		return hero;
	}	
	
	$scope.editItem = function(item) {
		if ($scope.comparingItem) {
			var item = $scope.editingItem;
			var index = $scope.hero.items.indexOf($scope.comparingItem);
			$scope.hero.items[index] = item;
			$scope.comparingItem = null;
		} else {
			$scope.editingItem = item;
		}
	};
	
	$scope.closeEdit = function() {
		$scope.editingItem = null;
	}
	
	$scope.compareItem = function(item) {
		if ($scope.comparingItem) {
			$scope.cancelCompare();
		}
	
		$scope.editingItem = item;
		$scope.comparingItem = new Item(item.slot, "");
		
		$scope.hero.skills.forEach(function(skill) {
			if (skill.dps() > 0) {
				skill.oldDps = skill.dps();
			}
		});
		
		var index = $scope.hero.items.indexOf(item);
		$scope.hero.items[index] = $scope.comparingItem;

		$scope.hero.skills.forEach(function(skill) {
			if (skill.dps() > 0) {
				skill.comparison = function() {
					return (skill.dps() - skill.oldDps) /  skill.oldDps;
				};
			}
		});
	};
	
	$scope.keepCompare = function() {
		$scope.editingItem = null;		
		$scope.comparingItem = null;
	}
	
	$scope.cancelCompare = function() {
		var index = $scope.hero.items.indexOf($scope.comparingItem);
		$scope.hero.items[index] = $scope.editingItem;
		$scope.comparingItem = null;
	}
	
	$scope.closeCompare = function() {
		$scope.cancelCompare();
		$scope.closeEdit();
	}
	
	$scope.showEffectDetails = function(effect) {
		if ($scope.effectDetails != effect) {
			$scope.effectDetails = effect;
		} else {
			$scope.effectDetails = null;		
		}
	}
	
	$scope.skillLvlFilter = function(item){
		return item.lvl > 0;
	}
	
	/* DATABASE */
	var loadHeroFromDB = function() {
		if ($scope.currentUser) {
			url = "https://spreadsheets.google.com/feeds/list/1n1i4GvdwohX3pwR3z9pQEGwrcsdev3l3YCn4ky11dP4/od6/public/full?alt=json&sq=user%3D"+$scope.currentUser+"%20and%20heroname%3D"+$scope.heroName;
			$http.get(url)
			.success(function(resp) {
				if (resp.feed.openSearch$totalResults.$t > 0) {
					resp.feed.entry.forEach(function(entry) {
						var slot = entry.gsx$slot.$t;
						if (slot == "Synergies") {
							var synergies = JSON.parse(entry.gsx$name.$t);
							synergies.forEach(function(synergy) {
								$scope.hero.setSynergyLevel(synergy.name, synergy.lvl);
							});
						} else if (slot == "Skills") {
							var skills = JSON.parse(entry.gsx$name.$t);
							skills.forEach(function(skill) {
								$scope.hero.setSkillLevel(skill.name, skill.lvl);
							});
						} else {
							var loadedItem = JSON.parse(entry.gsx$name.$t);
							var item = $scope.hero.getItemBySlot(loadedItem.slot);
							item.name = loadedItem.name;
							loadedItem.stats.forEach(function(stat) {
								item.stats.push(new Stat(stat.name, stat.value));
							});
							loadedItem.procs.forEach(function(proc) {
								item.procs.push(new Proc(proc.chance, proc.damage));
							});
							loadedItem.skillBonuses.forEach(function(skillBonus) {
								item.skillBonuses.push(new SkillBonus(skillBonus.skillName, skillBonus.value));
							});
							if (loadedItem.enchantment) {
								item.enchantment = findEnchantment(loadedItem.enchantment.name);
							}
							if (loadedItem.itemId) {
								$http.get("https://spreadsheets.google.com/feeds/list/1-NVwOqkajupPMSK7UbeP7HcDqy_T6aSEs6_v1iv3MrI/od6/public/full?alt=json&sq=id%3D"+loadedItem.itemId)
								.success(function(resp) {
									if (resp.feed.openSearch$totalResults.$t > 0) {
										item.itemId = loadedItem.itemId;
										item.name = resp.feed.entry[0].gsx$name.$t;
										item.link = resp.feed.entry[0].gsx$link.$t;
										item.link = item.link.replace(/\{(.*?)\}/g, function(s, m1) {return item.getStat(m1);});
										IB_Init();
									}
								});
							}
						}
					});
				}
			})
			.error(function(resp) {
				alert("Failed to load data : " + resp);
			});
		} else {
			alert("Error. Cannot load from DB, no user name provided.");		
		}
	}
	
	function cleanForm() {
		while (theForm.firstChild) {
			theForm.removeChild(theForm.firstChild);
		}
	}
	
	function addHidden(theForm, key, value) {
		var input = document.createElement('input');
		input.type = 'hidden';
		input.name = key;
		input.value = value;
		theForm.appendChild(input);
	}
	
	$scope.updateDB = function(hero){
		var user = $scope.currentUser;
		if (!user) {
			user = alert("Please login if you want to save your data. No password or account creation required.")
		} else {
			url = "https://spreadsheets.google.com/feeds/list/1n1i4GvdwohX3pwR3z9pQEGwrcsdev3l3YCn4ky11dP4/od6/public/full?alt=json&sq=user%3D"+user;
			$http.get(url).success(function(resp) {
				if (resp.feed.openSearch$totalResults.$t == 0 || user == $scope.currentUser) {
					$scope.currentUser = user;
					var theForm = document.getElementById('theForm');
					cleanForm(theForm);
					addHidden(theForm, 'User', $scope.currentUser);
					addHidden(theForm, 'HeroName', $scope.heroName);
					hero.items.forEach(function(item) {
						addHidden(theForm, item.slot+'_Name', JSON.stringify(item));
					});	
					addHidden(theForm, 'Synergies_Name', JSON.stringify($scope.hero.getActiveSynergies()));
					addHidden(theForm, 'Skills_Name', JSON.stringify($scope.hero.getSkillsLevel()));
					theForm.submit();
					alert('Submitted');
				} else {
					alert("There is already an existing profile with that name. If it's yours, please load it before trying to edit it.");
				}
			});
		}
	}
});
