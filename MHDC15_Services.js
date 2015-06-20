angular.module('MHDC15App')
.factory('excelService', function($http, $hero) {
	var loadHeroStats = function(heroName) {
		url = "https://spreadsheets.google.com/feeds/list/1pNRoV5zKlGfvh4WKO8_TbU2c_7SRQkj4tXPYrr0pZhE/od6/public/full?alt=json&sq=hero%3D"+heroName;
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
		url = "https://spreadsheets.google.com/feeds/list/1titE_7MhZYN8D1U-Rc9Pb80f8w9R1c649XhOpNbVbW0/od6/public/full?alt=json";
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
		url = "https://spreadsheets.google.com/feeds/list/1qlRMZw0AoxrVL5Pp9qLaBt-_v92WrTC6jFZrHun4d4M/od6/public/full?alt=json&sq=heroname%3D"+heroName;
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
	
	return {
		loadHeroStats : loadHeroStats,
		loadHeroSynergies : loadHeroSynergies,
		loadHeroSkills : loadHeroSkills
	};
})
