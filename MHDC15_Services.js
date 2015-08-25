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
							skill = $hero.addSkill(entry.skillName, 20, entry.tree, []);
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
		var url = "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Synergies?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
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
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Artifacts?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Legendary") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Legendaries?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Medal") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Medallions?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Relic") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Relics?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Slot1") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot1?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Slot2") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot2?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Slot3") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot3?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Slot4") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot4?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
		} else if (itemType == "Slot5") {
			return "https://api.mongolab.com/api/1/databases/mhdc_db/collections/Slot5?apiKey=aEDoJR0l_r7yjOT9w9tJ3WpgN0fi4jJ_";
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
	
	return {
		loadHeroStats : loadHeroStats,
		loadHeroSkills : loadHeroSkills,
		loadHeroSynergies : loadHeroSynergies,
		loadItems: loadItems
	};
})
.factory('excelService', function($http, $hero, $items) {
	var loadHeroStats = function(heroName) {
		var url = "https://spreadsheets.google.com/feeds/list/1pNRoV5zKlGfvh4WKO8_TbU2c_7SRQkj4tXPYrr0pZhE/od6/public/full?alt=json&sq=hero%3D"+heroName;
		return $http.get(url).then(
			function(resp) {
				if (resp.data.feed.openSearch$totalResults.$t > 0) {
					resp.data.feed.entry.forEach(function(entry) {
						/*hero			:	entry.gsx$hero.$t, 
						name			:	entry.gsx$name.$t, */
						$hero.baseStats.durability = parseInt(entry.gsx$durability.$t);
						$hero.baseStats.strength = parseInt(entry.gsx$strength.$t);
						$hero.baseStats.fighting = parseInt(entry.gsx$fighting.$t);
						$hero.baseStats.speed = parseInt(entry.gsx$speed.$t);
						$hero.baseStats.energy = parseInt(entry.gsx$energy.$t);
						$hero.baseStats.intelligence = parseInt(entry.gsx$intelligence.$t);
						/*dmgRat			:	parseFloat(entry.gsx$dmgrat.$t),
						dmgRat_melee	:	parseFloat(entry.gsx$dmgratmelee.$t),*/	
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
		var url = "https://spreadsheets.google.com/feeds/list/1titE_7MhZYN8D1U-Rc9Pb80f8w9R1c649XhOpNbVbW0/od6/public/full?alt=json";
		return $http.get(url).then(
			function(resp) {
				if (resp.data.feed.openSearch$totalResults.$t > 0) {
					resp.data.feed.entry.forEach(function(entry) {
						$hero.addSynergy(
							entry.gsx$name.$t,
							{name: entry.gsx$stat25name.$t, value: parseInt(entry.gsx$stat25value.$t)},
							{name: entry.gsx$stat50name.$t, value: parseInt(entry.gsx$stat50value.$t)}
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
	
	var loadHeroSkills = function(heroName) {
		var url = "https://spreadsheets.google.com/feeds/list/1qlRMZw0AoxrVL5Pp9qLaBt-_v92WrTC6jFZrHun4d4M/od6/public/full?alt=json&sq=heroname%3D"+heroName;
		return $http.get(url).then(
			function(resp) {
				if (resp.data.feed.openSearch$totalResults.$t > 0) {
					resp.data.feed.entry.forEach(function(entry) {
						var skill;
						$hero.skills.forEach(function(heroSkill) {
							if (heroSkill.name == entry.gsx$skillname.$t) {
								skill = heroSkill;
							}
						});
						if (!skill) {
							skill = $hero.addSkill(entry.gsx$skillname.$t, 20, entry.gsx$tree.$t, []);
						}
						
						if (entry.gsx$effect.$t == "ActiveEffect") {
							skill.addActiveEffect((entry.gsx$effectname.$t ? entry.gsx$effectname.$t : 'Attack'), parseFloat(entry.gsx$lvl1mindmg.$t), parseFloat(entry.gsx$lvl1maxdmg.$t), 
								parseFloat(entry.gsx$baseas.$t), parseFloat(entry.gsx$procrate.$t), entry.gsx$damagetype.$t, entry.gsx$proximity.$t, entry.gsx$extratags.$t);
						} else if (entry.gsx$effect.$t == "PassiveEffect") {
							skill.addPassiveEffect(entry.gsx$name.$t, parseFloat(entry.gsx$value.$t), entry.gsx$scope.$t);
						} else if (entry.gsx$effect.$t == "SpecialEffect") {
							skill.addSpecialEffect(entry.gsx$name.$t, entry.gsx$name.$t, entry.gsx$scope.$t);
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
	
	var loadPlayerHero = function(user) {
		var url = "https://spreadsheets.google.com/feeds/list/1n1i4GvdwohX3pwR3z9pQEGwrcsdev3l3YCn4ky11dP4/od6/public/full?alt=json&sq=user%3D"+user+"%20and%20heroname%3D"+$hero.name;
		$http.get(url)
		.success(function(resp) {
			if (resp.feed.openSearch$totalResults.$t > 0) {
				resp.feed.entry.forEach(function(entry) {
					var slot = entry.gsx$slot.$t;
					if (slot == "Synergies") {
						var synergies = JSON.parse(entry.gsx$name.$t);
						synergies.forEach(function(synergy) {
							$hero.setSynergyLevel(synergy.name, synergy.lvl);
						});
					} else if (slot == "Skills") {
						var skills = JSON.parse(entry.gsx$name.$t);
						skills.forEach(function(skill) {
							$hero.setSkillLevel(skill.name, skill.lvl);
						});
					} else {
						var loadedItem = JSON.parse(entry.gsx$name.$t);
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
							/*if (loadedItem.itemId) {
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
							}*/
						}
					}
				});
				$hero.calculate();
			}
		})
		.error(function(resp) {
			alert("Failed to load data : " + resp);
		});
	}
	
	return {
		loadHeroStats : loadHeroStats,
		loadHeroSynergies : loadHeroSynergies,
		loadHeroSkills : loadHeroSkills,
		loadPlayerHero : loadPlayerHero
	};
})
