angular.module('MHDC15App')
.factory('dataService', function($http, $hero, $items) {
	var loadHeroStats = function(heroName) {
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/HeroStats?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		return $http.get(url).then(
			function(resp) {
				if (resp.data.length > 0) {
					resp.data.forEach(function(entry) {
						$hero.baseStats.durability = parseInt(entry.durability);
						$hero.baseStats.strength = parseInt(entry.strength);
						$hero.baseStats.fighting = parseInt(entry.fighting);
						$hero.baseStats.speed = parseInt(entry.speed);
						$hero.baseStats.energy = parseInt(entry.energy);
						$hero.baseStats.intelligence = parseInt(entry.intelligence);
					});
					return "OK";
				}
			},
			function(resp) {
				alert("Failed to load data : " + resp);
				return [];
			}
		);
	}
	
	var loadHeroSkills = function(heroName) {
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Skills?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_"; //"Skills_"+heroName+".json"
		return $http.get(url).then(
			function(resp) {
				if (resp.data.length > 0) {
					resp.data.forEach(function(entry) {
						var skill;
						$hero.skills.forEach(function(heroSkill) {
							if (heroSkill.name == entry.skillName) {
								skill = heroSkill;
							}
						});
						if (!skill) {
							skill = $hero.addSkill(entry.skillName, 0, entry.tree, []);
						}
						
						if (entry.effect == "Active") {
							skill.addActiveEffect((entry.effectName ? entry.effectName : 'Attack'), parseFloat(entry.lvl1MinDmg), parseFloat(entry.lvl1MaxDmg), 
								parseFloat(entry.baseAS), parseFloat(entry.duration), parseFloat(entry.cooldown), 
								parseFloat(entry.procRate), entry.damageType, entry.proximity, entry.extraTags);
						} else if (entry.effect == "Passive") {
							skill.addPassiveEffect(entry.statName, parseFloat(entry.statValue), entry.statScope);
						} else if (entry.effect == "Special") {
							skill.addSpecialEffect(entry.statName, entry.statName, entry.statScope);
						}
					});
					return "OK";
				}
			},
			function(resp) {
				alert("Failed to load data : " + resp);
				return [];
			}
		);
	}
	
	var loadHeroSynergies = function() {
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Synergies?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		return $http.get(url).then(
			function(resp) {
				if (resp.data.length > 0) {
					resp.data.forEach(function(entry) {
						$hero.addSynergy(
							entry.name,
							{name: entry.stat25Name, value: parseInt(entry.stat25Value)},
							{name: entry.stat50Name, value: parseInt(entry.stat50Value)}
						);
					});
					return "OK";
				}
			},
			function(resp) {
				alert("Failed to load data : " + resp);
				return [];
			}
		)
	}
	
	var getServiceUrl = function(itemType) {
		if (itemType == "Artifact") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Artifacts?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Legendary") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Legendaries?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Medal") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Medallions?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Relic") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Relics?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Slot1") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot1?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Slot2") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot2?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Slot3") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot3?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Slot4") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot4?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		} else if (itemType == "Slot5") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot5?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&s={'name': 1}";
		}
	}
	
	var loadItems = function(itemType) {
		return $http.get(getServiceUrl(itemType)).then(
			function(resp) {
				if (resp.data.length > 0) {
					resp.data.forEach(function(entry) {
						$items.createItem(
							itemType,
							entry.name,
							entry.stats
						);
					});
					return "OK";
				}
			},
			function(resp) {
				alert("Failed to load data : " + resp);
				return [];
			}
		)
	}
	
	var loadPlayerHero = function(playerName) {
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Users?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&q={'player':'"+playerName+"'}";
		$http.get(url)
		.success(function(resp) {
			if (resp.length > 0) {
				var hero = resp[0];
				
				hero.synergies.forEach(function(synergy) {
					$hero.setSynergyLevel(synergy.name, synergy.lvl);
				});
					
				hero.skills.forEach(function(skill) {
					$hero.setSkillLevel(skill.name, skill.lvl);
				});
					
				hero.items.forEach(function(loadedItem) {
					var item = $items.getItemBySlot(loadedItem.slot);
					if (item) {
						item.name = loadedItem.name;
						loadedItem.stats.forEach(function(stat) {
							item.addStat(stat.name, stat.value);
						});
						loadedItem.procs.forEach(function(proc) {
							item.addProc(proc.chance, proc.damage);
						});
						loadedItem.skillBonuses.forEach(function(skillBonus) {
							item.addSkillBonus(skillBonus.skillName, skillBonus.value);
						});
						if (loadedItem.enchantment) {
							item.setEnchantment(loadedItem.enchantment.name);
						}
					}
				});
				
				if (hero.rotation) {
					$hero.rotation = new Object();
					
					Object.keys(hero.rotation).forEach(function(key) {
						$hero.rotation[key] = $hero.getSkillByName(hero.rotation[key]);
					});
				}
				
				$hero.calculate();
			}
		})
		.error(function(resp) {
			alert("Failed to load data : " + resp);
		});
	}
	
	var savePlayerHero = function(playerName) {
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Users?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_&q={'player':'"+playerName+"'}&u=true";

		var output = new Object();
		output.player = playerName;
		output.name = $hero.name;
		output.rotation = new Object();
		Object.keys($hero.rotation).forEach(function(key) {
			output.rotation[key] = $hero.rotation[key].name;
		});
		output.items = $items.getAll();
		output.synergies = $hero.getActiveSynergies();
		output.skills = $hero.getSkillsLevel();
		
		return $http.put(url, angular.toJson(output)).then(
			function(resp) {
				alert("Save successful !");
			},
			function(resp) {
				alert("Failed to save data : " + resp);
			}
		)
	}
	
	return {
		loadHeroStats : loadHeroStats,
		loadHeroSkills : loadHeroSkills,
		loadHeroSynergies : loadHeroSynergies,
		loadItems : loadItems,
		loadPlayerHero : loadPlayerHero,
		savePlayerHero : savePlayerHero
	};
});
