var enemyLvl = 60;
var slotsData = ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Art1", "Art2", "Art3", "Art4", "Medal", "Relic", "Ring", "Legendary", "Costume", "Insignia", "Uru", "Team-Up"];
var itemTypesData = ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Artifact", "Medal", "Relic", "Ring", "Legendary", "Costume", "Insignia", "Uru", "Team-Up"];
var statsData = ["AS", "dmgRat", "dmgRat_physical", "dmgRat_energy", "dmgRat_mental", "dmgRat_melee", "dmgRat_ranged", "dmgRat_area", "dmgRat_dot", "dmgRat_summon",
						"critRat", "critRat_physical", "critRat_energy", "critRat_mental", "critRat_melee", "critRat_ranged", "critRat_area", "critDmg", "brutRat", "brutDmg", 
						"strength", "fighting", "speed", "energy", "intelligence", "tree1", "tree2", "tree3", "spirit"];

angular.module('MHDC15App')
.factory('$items', function() {
	var items = [];
	slotsData.forEach(function(slot) {
		items.push(new Item(slot, ""));
	});

	var dbItems = [];
	itemTypesData.forEach(function(type) {
		dbItems[type] = [];
	});
	
	/* To be moved */
	var enchantments = InitEnchantments();
	
	function Item(slot, name) {
		this.slot = slot;
		this.name = name;
		this.stats = [];
		this.procs = [];
		this.skillBonuses = [];
		this.enchantment = null;
		
		this.getStat = function(statName) {
			var value = 0;
			for (var i = 0, len = this.stats.length;  i < len; i++) {
				if (this.stats[i].name == statName) {
					value = this.stats[i].value;
					break;
				}
			};
			return value;
		}
		
		this.addStat = function(statName, statValue) {
			this.stats.push(new Stat(statName, statValue));
		}
		this.addProc = function(procChance, procDamage) {
			this.procs.push(new Proc(procChance, procDamage));
		}
		this.addSkillBonus = function(skillName, value) {
			this.skillBonuses.push(new SkillBonus(skillName, value));
		}
		this.setEnchantment = function(name) {
			this.enchantment = findEnchantment(name);
		}
		this.getPossibleEnchantments = function() {
			var result = [];
			enchantments.forEach(function(enchantment) {
				if (enchantment.slots.indexOf(slot) > -1){
					result.push(enchantment);
				}
			});
			return result;
		};
	}
	
	function Stat(name, value) {
		this.name = name;
		this.value = value;
	}

	function Proc(chance, damage) {
		this.chance = chance;
		this.damage = damage;
	}

	function SkillBonus(skillName, value) {
		this.skillName = skillName;
		this.value = value;
	}
	
	function Enchantment(name, slots) {
		this.name = name;
		this.slots = slots;
		this.stats = [];
	}

	/* To be moved to a DB */
	function InitEnchantments() {
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
		
		return enchantments;
	}
	
	function findEnchantment(name) {
		var result = null;
		enchantments.forEach(function(enchantment) {
			if (enchantment.name == name) {
				result = enchantment;
			}
		});
		return result;
	}
	
	return {
		createNewItem: function(slot, name) {
			return new Item(slot, name);
		},
		createItem : function(itemType, name, stats) {
			var item = new Item(itemType, name);
			stats.forEach(function(stat) {
				if (statsData.indexOf(stat.name) > -1) {
					item.addStat(stat.name, parseFloat(stat.value));
				}
			});
			dbItems[itemType].push(item);
		},
		getItems: function(itemType) {
			return dbItems[itemType];
		},
		getAll: function() {
			return items
		},
		getItemBySlot: function(slot) {
			var result = null;
			items.forEach(function(item) {
				if (item.slot == slot) {
					result = item;
				}
			});
			return result;
		},
		getStatFromItems: function(statName) {
			var total = 0;
			items.forEach(function(item) {
				item.stats.forEach(function(itemStat) {
					if (itemStat.name == statName) {
						total += itemStat.value;
					}
				});
				if (item.enchantment) {
					item.enchantment.stats.forEach(function(enchantStat) {
						if (enchantStat.name == statName) {
							total += enchantStat.value;
						}
					});
				}
			});
			return total;
		},
	    getSkillBonus: function(skill) {
			var total = 0;
			items.forEach(function(item) {
				item.skillBonuses.forEach(function(skillBonus) {
					if (skillBonus.skillName == skill.name) {
						total += skillBonus.value;
					}
				});
			});
			return total;
		},
		getProcs: function() {
			var total = 0;
			items.forEach(function(item) {
				item.procs.forEach(function(proc) {
					total += (proc.chance/100) * proc.damage;
				});
			});
			return total;
		}
	}
})
.factory('$hero', function($items) {
	var hero = new Hero();
	hero.name = "SW";
	return hero;
	
	function Hero() {
		this.name;
		this.baseStats = new Attributes();
		this.skills = [];
		this.synergies = [];
		
		this.getTotalStat = function(statName, targetSkill) {
			var total = 0;
			total += $items.getStatFromItems(statName);
			total += this.getStatFromSkills(statName, targetSkill);
			total += this.getSynergyBonus(statName);
			if (statName == "AS") {
				var AS = total + (this.baseStats.speed + $items.getStatFromItems("speed")) * 1;
				var AS_DR = 0.4 * (1 - Math.exp(-3*AS/100)) * 100;
				
				total = (AS < AS_DR ? AS : AS_DR);
			}
			if (statName == "critRat") {
				total += (this.baseStats.intelligence + $items.getStatFromItems("intelligence")) * 30;
			}
			if (statName == "critDmg") {
				total += (this.baseStats.intelligence + $items.getStatFromItems("intelligence")) * 90;
			}
			if (statName == "brutRat") {
				total += (this.baseStats.fighting + $items.getStatFromItems("fighting")) * 60;
			}
			if (statName == "brutDmg") {
				total += (this.baseStats.fighting + $items.getStatFromItems("fighting")) * 180;
			}
			if (statName == "spirit") {
				total += (this.baseStats.intelligence + $items.getStatFromItems("intelligence")) * 2;
			}
			return total;
		};
		
		this.getStatFromSkills = function(statName, targetSkill) {
			var total = 0;
			this.skills.forEach(function(skill) {
				total += skill.getStatValue(statName, (skill == targetSkill));
			});
			return total;
		}

		this.getPhysicalBonusDmg = function(withItems) {
			if (withItems) {
				return this.fighting * 0.03 + this.strength * 0.04;
			} else {
				return this.baseStats.fighting * 0.03 + this.baseStats.strength * 0.04;
			}
		};
		
		this.getMentalBonusDmg = function(withItems) {
			if (withItems) {
				return this.fighting * 0.03 + this.energy * 0.04;
			} else {
				return this.baseStats.fighting * 0.03 + this.baseStats.energy * 0.04;
			}
		};
		
		this.getSummonBonusDmg = function(withItems) {
			if (withItems) {
				return this.intelligence * 0.04;
			} else {
				return this.baseStats.intelligence * 0.04;
			}
		}
		
		this.getSkillByName = function(name) {
			var result = null;
			this.skills.forEach(function(skill) {
				if (skill.name == name) {
					result = skill;
				}
			});
			return result;
		};
		
		this.getSkillByPrio = function(prio) {
			var result = null;
			this.skills.forEach(function(skill) {
				if (skill.prio == prio) {
					result = skill;
				}
			});
			return result;
		};

		this.countActiveSynergies = function() {
			var total = 0;
			this.synergies.forEach(function(synergy) {
				if (synergy.isActive()) {
					total++;
				}
			});
			return total;
		}
		
		this.getActiveSynergies = function() {
			var synergies = [];
			this.synergies.forEach(function(synergy) {
				if (synergy.isActive()) {
					synergies.push({name:synergy.name, lvl:synergy.lvl});
				}
			});
			return synergies;
		}
		
		this.setSynergyLevel = function(name, lvl) {
			this.synergies.forEach(function(synergy) {
				if (synergy.name == name) {
					synergy.lvl = lvl;
				}
			});
		};
		
		this.getSynergyBonus = function(statName) {
			var total = 0;
			this.synergies.forEach(function(synergy) {
				if (synergy.lvl25Stat.name == statName && synergy.lvl >= 25) {
					total = total + synergy.lvl25Stat.value;
				}
				if (synergy.lvl50Stat.name == statName && synergy.lvl == 50) {
					total = total + synergy.lvl50Stat.value;
				}
			});
			return total;
		};
		
		this.getSkillsLevel = function() {
			var skills = [];
			this.skills.forEach(function(skill) {
				skills.push({name:skill.name, lvl:skill.lvl});
			});
			return skills;
		}
		
		this.setSkillLevel = function(name, lvl) {
			this.skills.forEach(function(skill) {
				if (skill.name == name) {
					skill.lvl = lvl;
				}
			});
		};
		
		this.addSkill = function(name, lvl, tree, effects) {
			var skill = new Skill(name, lvl, tree);
			skill.effects = effects;
			this.skills.push(skill);
			return skill;
		}
		
		this.addSynergy = function(name, lvl25Stat, lvl50Stat) {
			this.synergies.push(new Synergy(name, lvl25Stat, lvl50Stat));
		}
		
		this.calculate = function() {
			this.strength = this.baseStats.strength + this.getTotalStat("strength");
			this.durability = this.baseStats.durability + this.getTotalStat("durability");
			this.fighting = this.baseStats.fighting + this.getTotalStat("fighting");
			this.speed = this.baseStats.speed + this.getTotalStat("speed");
			this.energy = this.baseStats.energy + this.getTotalStat("energy");
			this.intelligence = this.baseStats.intelligence + this.getTotalStat("intelligence");
			
			this.dmgRat = this.getTotalStat("dmgRat");
			this.dmgRatPhysical = this.getTotalStat("dmgRat_physical");
			this.dmgRatEnergy = this.getTotalStat("dmgRat_energy");
			this.dmgRatMental = this.getTotalStat("dmgRat_mental");
			this.dmgRatMelee = this.getTotalStat("dmgRat_melee");
			this.dmgRatRanged = this.getTotalStat("dmgRat_ranged");
			this.dmgRatArea = this.getTotalStat("dmgRat_area");
			this.dmgRatDot = this.getTotalStat("dmgRat_dot");

			this.dmgRatPc = this.getTotalStat("dmgRat_pc");
			this.dmgRatPhysicalPc = this.getTotalStat("dmgRat_physical_pc");
			this.dmgRatEnergyPc = this.getTotalStat("dmgRat_energy_pc");
			this.dmgRatMentalPc = this.getTotalStat("dmgRat_mental_pc");
			this.dmgRatMeleePc = this.getTotalStat("dmgRat_melee_pc");
			this.dmgRatRangedPc = this.getTotalStat("dmgRat_ranged_pc");
			this.dmgRatAreaPc = this.getTotalStat("dmgRat_area_pc");
			this.dmgRatDotPc = this.getTotalStat("dmgRat_dot_pc");
			this.dmgRatSummonPc = this.getTotalStat("dmgRat_summon_pc");
			
			this.AS = this.getTotalStat("AS");
			
			this.critRat = this.getTotalStat("critRat");
			this.critRatPhysical = this.getTotalStat("critRat_physical");
			this.critRatEnergy = this.getTotalStat("critRat_energy");
			this.critRatMental = this.getTotalStat("critRat_mental");
			this.critRatMelee = this.getTotalStat("critRat_melee");
			this.critRatRanged = this.getTotalStat("critRat_ranged");
			this.critRatArea = this.getTotalStat("critRat_area");
			
			this.critRatPc = this.getTotalStat("critRat_pc");
			this.critRatPhysicalPc = this.getTotalStat("critRat_physical_pc");
			this.critRatEnergyPc = this.getTotalStat("critRat_energy_pc");
			this.critRatMentalPc = this.getTotalStat("critRat_mental_pc");
			
			this.critDmg = this.getTotalStat("critDmg");
			this.brutRat = this.getTotalStat("brutRat");
			this.brutDmg = this.getTotalStat("brutDmg");

			this.critDmgPc = this.getTotalStat("critDmg_pc");
			this.brutRatPc = this.getTotalStat("brutRat_pc");
			this.brutDmgPc = this.getTotalStat("brutDmg_pc");

			this.spirit = this.getTotalStat("spirit");
			
			this.skills.forEach(function(skill) {
				skill.calculate();
			});
		}
		this.calculate();
	};
	
	function Skill(name, lvl, tree) {
		this.name = name;
		this.lvl = lvl;
		this.tree = tree;
		this.effects = [];
		
		this.hasActive = function() {
			var hasActive = false;
			this.effects.forEach(function(effect) {
				if (effect.isActive()) {
					hasActive = true;
				};
			});
			return hasActive;
		}
		
		this.totalLvl = function() {
			if (this.lvl > 0) {
				return this.lvl + $items.getStatFromItems(this.tree) + $items.getSkillBonus(this);
			} else {
				return 0;
			}
		}
		
		this.getActiveEffects = function() {
			var activeEffects = [];
			this.effects.forEach(function(effect) {
				if (effect.isActive()) {
					activeEffects.push(effect);
				}
			});
			return activeEffects;
		};
		this.getPassiveEffects = function() {
			var passiveEffects = [];
			this.effects.forEach(function(effect) {
				if (!effect.isActive()) {
					passiveEffects.push(effect);
				}
			});
			return passiveEffects;
		};
		
		this.getStatValue = function(statName, includeSkillScope) {
			var skill = this;
			var total = 0;
			var skillLvl = this.totalLvl();
			if (skillLvl > 0) {
				this.getPassiveEffects().forEach(function(effect) {
					total += effect.getStatValue(skillLvl, statName, includeSkillScope);
				});
			}
			return total;
		}
		
		this.addActiveEffect = function(name, lvl1MinDmg, lvl1MaxDmg, baseAS, duration, cooldown, procRate, damageType, proximity, extraTags) {
			this.effects.push(new ActiveEffect(name, lvl1MinDmg, lvl1MaxDmg, baseAS, duration, cooldown, procRate, damageType, proximity, extraTags));
		}
		this.addPassiveEffect = function(name, value, scope) {
			this.effects.push(new PassiveEffect(name, value, scope));
		}
		this.addSpecialEffect = function(name, statName, scope) {
			this.effects.push(new SpecialEffect(name, statName, scope));
		}
		
		this.calculate = function() {
			var totalDps = 0;
			var skillLvl = this.totalLvl();
			
			this.getActiveEffects().forEach(function(activeEffect) {
				activeEffect.calculate(skillLvl);
				totalDps += activeEffect.dps;
			});	
			this.dps = totalDps;
		}
	}
	
	function ActiveEffect(name, lvl1MinDmg, lvl1MaxDmg, baseAS, duration, cooldown, procRate, damageType, proximity, extraTags) {
		this.name = name;
		this.lvl1MinDmg = lvl1MinDmg;
		this.lvl1MaxDmg = lvl1MaxDmg;
		this.baseAS = baseAS;
		this.duration = duration;
		this.cooldown = cooldown;
		this.procRate = procRate;
		this.damageType = damageType;
		this.proximity = proximity;
		this.extraTags = extraTags;
		
		this.isActive = function() {
			return true;
		}
		
		this.isPhysical = function() {
			return this.damageType.indexOf("P") > -1;
		}
		this.isEnergy = function() {
			return this.damageType.indexOf("E") > -1;
		}
		this.isMental = function() {
			return this.damageType.indexOf("M") > -1;
		}
		
		this.isMelee = function() {
			return this.proximity.indexOf("M") > -1;
		}
		this.isRanged = function() {
			return this.proximity.indexOf("R") > -1;
		}
		
		this.isArea = function() {
			return this.extraTags.indexOf("A") > -1;
		}
		this.isBasic = function() {
			return this.extraTags.indexOf("B") > -1;
		}
		this.hasCooldown = function() {
			return this.extraTags.indexOf("C") > -1;
		}
		this.isDot = function() {
			return this.extraTags.indexOf("D") > -1;
		}
		this.isMvt = function() {
			return this.extraTags.indexOf("M") > -1;
		}
		this.isBarrage = function() {
			return this.extraTags.indexOf("R") > -1;
		}
		this.isSummon = function() {
			return this.extraTags.indexOf("S") > -1;
		}
		
		this.calculateBaseDmg = function(skillLvl) {
			var avgDmg = (this.lvl1MinDmg + this.lvl1MaxDmg)/2;
			var level = (skillLvl > 0 ? (skillLvl-1) : 0);
			return avgDmg * (1+(0.1*level)) / (1 + 
				(this.isPhysical() ? hero.getPhysicalBonusDmg(false) : 0) +
				(this.isEnergy() || this.isMental() ? hero.getMentalBonusDmg(false) : 0) + 
				(hero.baseStats.dmgRat ? (hero.baseStats.dmgRat/enemyLvl*0.015) : 0) +
				(this.isMelee() && hero.baseStats.dmgRat_melee ? (hero.baseStats.dmgRat_melee/enemyLvl*0.015) : 0) +
				(this.isSummon() ? hero.getSummonBonusDmg(false) : 0));
				
		};
		this.calculateAS = function(skillLvl) {
			return this.isDot() || this.isMvt() || this.hasCooldown() || this.isSummon() ? this.baseAS : (this.baseAS * (1+hero.AS/100) * (this.isBarrage() ? (1+(skillLvl-1)/100) : 1));
		};
		this.calculateDmgRat = function() {
			return hero.dmgRat + 
				(this.isPhysical() ? hero.dmgRatPhysical : 0) +
				(this.isEnergy() ? hero.dmgRatEnergy : 0) +
				(this.isMental() ? hero.dmgRatMental : 0) +
				(this.isMelee() ? hero.dmgRatMelee : 0) +
				(this.isRanged() ? hero.dmgRatRanged : 0) +
				(this.isArea() ? hero.dmgRatArea : 0) +
				(this.isDot() ? hero.dmgRatDot : 0);
		};
		this.calculateDmgRatFact = function() { 
			return this.dmgRat/enemyLvl*0.015 +
				hero.dmgRatPc/100 +
				(this.isPhysical() ? hero.dmgRatPhysicalPc/100 : 0) +
				(this.isEnergy() ? hero.dmgRatEnergyPc/100 : 0) +
				(this.isMental() ? hero.dmgRatMentalPc/100 : 0) +
				(this.isMelee() ? hero.dmgRatMeleePc/100 : 0) +
				(this.isRanged() ? hero.dmgRatRangedPc/100 : 0) +
				(this.isArea() ? hero.dmgRatAreaPc/100 : 0) +
				(this.isDot() ? hero.dmgRatDotPc/100 : 0) +
				(this.isSummon() ? hero.dmgRatSummonPc/100 : 0);
		};
		this.calculateDmgFact = function() {
			return this.dmgRatFact +
				(this.isPhysical() ? hero.getPhysicalBonusDmg(true) : 0) +
				(this.isEnergy() || this.isMental() ? hero.getMentalBonusDmg(true) : 0) +
				(this.isSummon() ? hero.getSummonBonusDmg(true) : 0);
		};
		this.calculateDmg = function() {
			return this.baseDmg*(1+this.dmgFact)
		};
		this.calculateCritRatFact = function() {
			var critRat = hero.critRat +
				(this.isPhysical() ? hero.critRatPhysical : 0) +
				(this.isEnergy() ? hero.critRatEnergy : 0) +
				(this.isMental() ? hero.critRatMental : 0) +
				(this.isMelee() ? hero.critRatMelee : 0) +
				(this.isRanged() ? hero.critRatRanged : 0) +
				(this.isArea() ? hero.critRatArea : 0);
				
			var critRatFact = ((99 * critRat)/(critRat + 60 * enemyLvl + 1)/100);
			critRatFact += hero.critRatPc/100;
			critRatFact += (this.isPhysical() ? hero.critRatPhysicalPc/100 : 0);
			critRatFact += (this.isEnergy() ? hero.critRatEnergyPc/100 : 0);
			critRatFact += (this.isMental() ? hero.critRatMentalPc/100 : 0);
			
			return critRatFact;
		};
		this.calculateCritDmgFact = function() {
			var critDmg = hero.critDmg;
			var critDmgFact = ((150 + critDmg/enemyLvl * 0.75)/100);
			critDmgFact += hero.critDmgPc/100;
			
			return critDmgFact;
		};
		this.calculateBrutRatFact = function() {
			var brutRat = hero.brutRat;
			var brutRatFact = ((75 * brutRat)/(brutRat + 60 * enemyLvl + 1)/100);
			brutRatFact += hero.brutRatPc/100;
			
			return brutRatFact;
		};
		this.calculateBrutDmgFact = function() {
			var critDmg = hero.critDmg;
			var brutDmg = hero.brutDmg;
			var brutDmgFact = ((300 + ((critDmg+brutDmg)/enemyLvl * 0.75))/100);
			brutDmgFact += hero.brutDmgPc/100;
			
			return brutDmgFact;
		};
		this.calculateCritFact = function() {
			return (1 - this.critRatFact) * 1 + 
					(this.critRatFact - (this.brutRatFact * this.critRatFact)) * this.critDmgFact +
					(this.brutRatFact * this.critRatFact) * this.brutDmgFact;
		};
		this.calculateDps = function() {
			return this.dmg*this.critFact*this.AS + $items.getProcs()*this.AS*this.procRate;
		};
		
		this.calculate = function(skillLvl) {
			this.baseDmg = this.calculateBaseDmg(skillLvl);
			this.AS = this.calculateAS(skillLvl);
			this.dmgRat = this.calculateDmgRat();
			this.dmgRatFact = this.calculateDmgRatFact();
			this.dmgFact = this.calculateDmgFact();
			this.dmg = this.calculateDmg();
			this.critRatFact = this.calculateCritRatFact();
			this.critDmgFact = this.calculateCritDmgFact();
			this.brutRatFact = this.calculateBrutRatFact();
			this.brutDmgFact = this.calculateBrutDmgFact();
			this.critFact = this.calculateCritFact();
			this.dps = this.calculateDps();
		}
	};

	function PassiveEffect(name, value, scope) {
		this.stat = new Stat(name, value);
		this.scope = scope;
		this.buffEnabled = false;
		
		this.isActive = function() {
			return false;
		}
		this.isBuffEnabled = function() {
			return this.buffEnabled;
		}
		
		this.isGlobalScope = function() {
			return this.scope.indexOf("G") > -1;
		}
		this.isSkillScope = function() {
			return this.scope.indexOf("S") > -1;
		}
		this.isAura = function() {
			return this.scope.indexOf("A") > -1;
		}
		this.isBuff = function() {
			return this.scope.indexOf("B") > -1;
		}
		
		this.getStatValue = function(skillLvl, statName, includeSkillScope) {
			var total = 0;
			if (includeSkillScope || !this.isSkillScope()) {
				if (this.stat.name == statName && (!this.isBuff() || this.isBuffEnabled())) {
					if (this.isAura()) {
						total += this.stat.value;
					} else {
						var gainPerLevel;
						if (statName == "AS") {
							gainPerLevel = 0.25;
						} else if (statName == "spirit") {
							gainPerLevel = 2.9;
						} else {
							gainPerLevel = this.stat.value * 0.1;
						}
						total += this.stat.value + (gainPerLevel * (skillLvl-1));
					}
				}
			}
			return total;
		}
	};

	function SpecialEffect(name, statName, scope) {
		this.name = name;
		this.stat = new Stat(statName, 0);
		this.scope = scope;
		this.buffEnabled = false;
		
		this.isActive = function() {
			return false;
		}
		this.isBuffEnabled = function() {
			return this.buffEnabled;
		}
		
		this.isGlobalScope = function() {
			return this.scope.indexOf("G") > -1;
		}
		this.isSkillScope = function() {
			return this.scope.indexOf("S") > -1;
		}
		this.isAura = function() {
			return this.scope.indexOf("A") > -1;
		}
		this.isBuff = function() {
			return this.scope.indexOf("B") > -1;
		}
		
		this.getStatValue = function(skillLvl, statName, includeSkillScope) {
			var total = 0;
			if (includeSkillScope || !this.isSkillScope()) {
				if (this.stat.name == statName && (!this.isBuff() || this.isBuffEnabled())) {
					if (this.name == "ARE") { // Arc Reactor Enhancement for Iron Man
						totalSpirit = hero.spirit + 60;
						total += totalSpirit * 3;
					}
				}
			}
			return total;
		}
	};

	function Attributes() {
		this.durability = 0;
		this.strength = 0;
		this.fighting = 0;
		this.speed = 0;
		this.energy = 0;
		this.intelligence = 0;
	}

	function Stat(name, value) {
		this.name = name;
		this.value = value;
	}

	function Synergy(name, lvl25Stat, lvl50Stat) {
		this.name = name;
		this.lvl = 0;
		this.lvl25Stat = new Stat(lvl25Stat.name, lvl25Stat.value);
		this.lvl50Stat = new Stat(lvl50Stat.name, lvl50Stat.value);
		this.isActive = function() {
			return (this.lvl > 0);
		};
	}
})
