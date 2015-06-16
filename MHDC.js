angular.module('MHDC15App', ['MHDCLib', 'ngAnimate'])
.run(function($rootScope, $http, $q) {
	var loadHeroesStats = function() {
		url = "https://spreadsheets.google.com/feeds/list/1pNRoV5zKlGfvh4WKO8_TbU2c_7SRQkj4tXPYrr0pZhE/od6/public/full?alt=json";
		$http.get(url)
		.success(function(resp) {
			if (resp.feed.openSearch$totalResults.$t > 0) {
				resp.feed.entry.forEach(function(entry) {
					heroesBaseStats.push({
						hero			:	entry.gsx$hero.$t, 
						name			:	entry.gsx$name.$t, 
						durability		:	parseInt(entry.gsx$durability.$t), 
						strength		:	parseInt(entry.gsx$strength.$t), 
						fighting		:	parseInt(entry.gsx$fighting.$t), 
						speed			:	parseInt(entry.gsx$speed.$t), 
						energy			:	parseInt(entry.gsx$energy.$t), 
						intelligence	:	parseInt(entry.gsx$intelligence.$t), 
						dmgRat			:	parseFloat(entry.gsx$dmgrat.$t),
						dmgRat_melee	:	parseFloat(entry.gsx$dmgratmelee.$t),						
					});
				});
			}
		})
		.error(function(resp) {
			alert("Failed to load data : " + resp);
		});
	}
	
	var loadHeroesSynergies = function() {
		url = "https://spreadsheets.google.com/feeds/list/1titE_7MhZYN8D1U-Rc9Pb80f8w9R1c649XhOpNbVbW0/od6/public/full?alt=json";
		$http.get(url)
		.success(function(resp) {
			if (resp.feed.openSearch$totalResults.$t > 0) {
				resp.feed.entry.forEach(function(entry) {
					heroesSynergies.push(new Synergy(
						entry.gsx$name.$t,
						{name: entry.gsx$stat25name.$t, value: parseInt(entry.gsx$stat25value.$t)},
						{name: entry.gsx$stat50name.$t, value: parseInt(entry.gsx$stat50value.$t)}
					));
				});
			}
		})
		.error(function(resp) {
			alert("Failed to load data : " + resp);
		});
	}
	
	var loadHeroSkills = function(heroName) {
		var deferred = $q.defer();
	
		url = "https://spreadsheets.google.com/feeds/list/1qlRMZw0AoxrVL5Pp9qLaBt-_v92WrTC6jFZrHun4d4M/od6/public/full?alt=json&sq=heroname%3D"+heroName;
		$http.get(url)
		.success(function(resp) {
			if (resp.feed.openSearch$totalResults.$t > 0) {
				var heroSkills = [];
				resp.feed.entry.forEach(function(entry) {
					var skill;
					heroSkills.forEach(function(heroSkill) {
						if (heroSkill.name == entry.gsx$skillname.$t) {
							skill = heroSkill;
						}
					});
					if (!skill) {
						skill = {name:entry.gsx$skillname.$t, tree:entry.gsx$tree.$t}
						skill.effects = [];
						heroSkills.push(skill);
					}
					if (entry.gsx$effect.$t == "ActiveEffect") {
						skill.effects.push({effect:entry.gsx$effect.$t, name:entry.gsx$effectname.$t, lvl1MinDmg:parseFloat(entry.gsx$lvl1mindmg.$t), lvl1MaxDmg:parseFloat(entry.gsx$lvl1maxdmg.$t), baseAS:parseFloat(entry.gsx$baseas.$t),
							procRate:parseFloat(entry.gsx$procrate.$t), damageType:entry.gsx$damagetype.$t, proximity:entry.gsx$proximity.$t, extraTags:entry.gsx$extratags.$t});
					} else if (entry.gsx$effect.$t == "PassiveEffect") {
						skill.effects.push({effect:entry.gsx$effect.$t, name:entry.gsx$name.$t, value:parseFloat(entry.gsx$value.$t), scope:entry.gsx$scope.$t});
					} else if (entry.gsx$effect.$t == "SpecialEffect") {
						skill.effects.push({effect:entry.gsx$effect.$t, name:entry.gsx$effectname.$t, statName:entry.gsx$name.$t, scope:entry.gsx$scope.$t});
					}
				});
				heroesSkills.push({name:heroName, skills:heroSkills});
				deferred.resolve(heroSkills);
			}
		})
		.error(function(resp) {
			alert("Failed to load data : " + resp);
		});
		
		return deferred.promise;
	}
	
	var addSkills = function(hero, skillsData) {
		skillsData.forEach(function(skillData) {
			var skill = new Skill(hero, skillData.name, 20, skillData.tree);
			skillData.effects.forEach(function(effectData) {
				if (effectData.effect == "ActiveEffect") {
					skill.effects.push(new ActiveEffect(skill, (effectData.name ? effectData.name : 'Attack'), effectData.lvl1MinDmg, effectData.lvl1MaxDmg, 
						effectData.baseAS, effectData.procRate, effectData.damageType, effectData.proximity, effectData.extraTags));
				} else if (effectData.effect == "PassiveEffect") {
					skill.effects.push(new PassiveEffect(skill, effectData.name, effectData.value, effectData.scope));
				} else if (effectData.effect == "SpecialEffect") {
					skill.effects.push(new SpecialEffect(skill, effectData.name, effectData.statName, effectData.scope));
				}
			});
			hero.skills.push(skill);
		});	
	};
	
	$rootScope.getHeroBaseStats = function(heroCode) {
		for (i=0; i<heroesBaseStats.length; i++) {
			if (heroesBaseStats[i].hero == heroCode) {
				return heroesBaseStats[i];
			}
		}
	}
	
	$rootScope.getHeroesSynergies = function() {
		return heroesSynergies;
	}
	
	$rootScope.initSkills = function(hero, heroName) {
		var skillsData = [];
		heroesSkills.forEach(function(hero) {
			if (hero.name == heroName) {
				skillsData = hero.skills;
			}
		});
		if (!skillsData.length) {
			skillsData = loadHeroSkills(heroName);
			skillsData.then(function(skillsData) {
				addSkills(hero, skillsData);
			});
		} else {
			addSkills(hero, skillsData);
		}
	}
})
.controller('MainCtrl', function ($scope) {
	$scope.heroName = "SW";
	$scope.currentUser = "Razhil";
	
	$scope.login = function() {
		if (!$scope.username) {
			alert("Please enter a user name.");		
		} else if ($scope.username.indexOf(" ") > -1) {
			alert("Your user name cannot contain a space or other special characters.")
		} else {
			$scope.currentUser = $scope.username;
		}
	}
	
	$scope.reload = function() {
		$scope.$broadcast('reload');
	}
});
