var enemyLvl = 60;
var slots = ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Art1", "Art2", "Art3", "Art4", "Medal", "Relic", "Ring", "Legendary", "Costume", "Insignia", "Uru", "Team-Up", "Omega"];

angular.module('MHDC15App')
.factory('$hero', function () {
	var hero = new Hero();
	return hero;
	
	function Hero() {
		this.name;
		this.baseStats = new Attributes();
		var items = [];
		this.items = items;
		slots.forEach(function(slot) {
			items.push(new Item(slot, ""));
		});
		this.skills = [];
		this.synergies = [];
		
		this.getTotalStat = function(statName, targetSkill) {
			var total = 0;
			total += this.getStatFromItems(statName);
			total += this.getStatFromSkills(statName, targetSkill);
			total += this.getSynergyBonus(statName);
			if (statName == "AS") {
				var AS = total + (this.baseStats.speed + this.getStatFromItems("speed")) * 1;
				var AS_DR = 0.4 * (1 - Math.exp(-3*AS/100)) * 100;
				
				total = (AS < AS_DR ? AS : AS_DR);
			}
			if (statName == "critRat") {
				total += (this.baseStats.intelligence + this.getStatFromItems("intelligence")) * 30;
			}
			if (statName == "critDmg") {
				total += (this.baseStats.intelligence + this.getStatFromItems("intelligence")) * 90;
			}
			if (statName == "brutRat") {
				total += (this.baseStats.fighting + this.getStatFromItems("fighting")) * 60;
			}
			if (statName == "brutDmg") {
				total += (this.baseStats.fighting + this.getStatFromItems("fighting")) * 180;
			}
			if (statName == "spirit") {
				total += (this.baseStats.intelligence + this.getStatFromItems("intelligence")) * 2;
			}
			return total;
		};
		
		this.getStatFromItems = function(statName) {
			var total = 0;
			this.items.forEach(function(item) {
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
		}
		
		this.getStatFromSkills = function(statName, targetSkill) {
			var total = 0;
			this.skills.forEach(function(skill) {
				total += skill.getStatValue(statName, (skill == targetSkill));
			});
			return total;
		}
		
		this.getItemBySlot = function(slot) {
			var result = null;
			this.items.forEach(function(item) {
				if (item.slot == slot) {
					result = item;
				}
			});
			return result;
		};

		this.getPhysicalBonusDmg = function(withItems) {
			var fighting = this.baseStats.fighting;
			var strength = this.baseStats.strength;
			if (withItems) {
				fighting += this.getTotalStat("fighting");
				strength += this.getTotalStat("strength");
			}
			return fighting * 0.03 + strength * 0.04;
		};
		
		this.getMentalBonusDmg = function(withItems) {
			var fighting = this.baseStats.fighting;
			var energy = this.baseStats.energy;
			if (withItems) {
				fighting += this.getTotalStat("fighting");
				energy += this.getTotalStat("energy");
			}
			return fighting * 0.03 + energy * 0.04;
		};
		
		this.getSummonBonusDmg = function(withItems) {
			var intelligence = this.baseStats.intelligence;
			if (withItems) {
				intelligence += this.getTotalStat("intelligence");
			}
			return intelligence * 0.04;
		}
		
		this.getProcs = function() {
			var total = 0;
			this.items.forEach(function(item) {
				item.procs.forEach(function(proc) {
					total += (proc.chance/100) * proc.damage;
				});
			});
			return total;
		};
		
		this.getSkillByName = function(name) {
			var result = null;
			this.skills.forEach(function(skill) {
				if (skill.name == name) {
					result = skill;
				}
			});
			return result;
		};
		
		this.getSkillBonus = function(skill) {
			var total = 0;
			this.items.forEach(function(item) {
				item.skillBonuses.forEach(function(skillBonus) {
					if (skillBonus.skillName == skill.name) {
						total += skillBonus.value;
					}
				});
			});
			return total;
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
				return this.lvl + hero.getStatFromItems(this.tree) + hero.getSkillBonus(this);
			} else {
				return 0;
			}
		}
		
		this.dps = function() {
			var skill = this;
			var total = 0;
			this.effects.forEach(function(effect) {
				if (effect.isActive()) {
					total += effect.dps();
				}
			});
			return total;
		};
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
			var totalLvl = this.totalLvl();
			if (totalLvl > 0) {
				this.getPassiveEffects().forEach(function(effect) {
					total += effect.getStatValue(statName, includeSkillScope);
				});
			}
			return total;
		}
		
		this.addActiveEffect = function(name, lvl1MinDmg, lvl1MaxDmg, baseAS, procRate, damageType, proximity, extraTags) {
			this.effects.push(new ActiveEffect(this, name, lvl1MinDmg, lvl1MaxDmg, baseAS, procRate, damageType, proximity, extraTags));
		}
		this.addPassiveEffect = function(name, value, scope) {
			this.effects.push(new PassiveEffect(this, name, value, scope));
		}
		this.addSpecialEffect = function(name, statName, scope) {
			this.effects.push(new SpecialEffect(this, name, statName, scope));
		}
	}
	
	function ActiveEffect(skill, name, lvl1MinDmg, lvl1MaxDmg, baseAS, procRate, damageType, proximity, extraTags) {
		this.skill = skill;
		this.name = name;
		this.lvl1MinDmg = lvl1MinDmg;
		this.lvl1MaxDmg = lvl1MaxDmg;
		this.baseAS = baseAS;
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
		
		this.baseDmg = function() {
			var avgDmg = (this.lvl1MinDmg + this.lvl1MaxDmg)/2;
			var level = (skill.totalLvl() > 0 ? (skill.totalLvl()-1) : 0);
			return avgDmg * (1+(0.1*level)) / (1 + 
				(this.isPhysical() ? hero.getPhysicalBonusDmg(false) : 0) +
				(this.isEnergy() || this.isMental() ? hero.getMentalBonusDmg(false) : 0) + 
				(hero.baseStats.dmgRat ? (hero.baseStats.dmgRat/enemyLvl*0.015) : 0) +
				(this.isMelee() && hero.baseStats.dmgRat_melee ? (hero.baseStats.dmgRat_melee/enemyLvl*0.015) : 0) +
				(this.isSummon() ? hero.getSummonBonusDmg(false) : 0));
				
		};
		this.AS = function() {
			return this.isDot() || this.isMvt() || this.hasCooldown() || this.isSummon() ? this.baseAS : (this.baseAS * (1+hero.getTotalStat("AS", skill)/100) * (this.isBarrage() ? (1+(skill.lvl-1)/100) : 1));
		};
		this.dmgRat = function() {
			return hero.getTotalStat("dmgRat", skill) + 
				(this.isPhysical() ? hero.getTotalStat("dmgRat_physical", skill) : 0) +
				(this.isEnergy() ? hero.getTotalStat("dmgRat_energy", skill) : 0) +
				(this.isMental() ? hero.getTotalStat("dmgRat_mental", skill) : 0) +
				(this.isMelee() ? hero.getTotalStat("dmgRat_melee", skill) : 0) +
				(this.isRanged() ? hero.getTotalStat("dmgRat_ranged", skill) : 0) +
				(this.isArea() ? hero.getTotalStat("dmgRat_area", skill) : 0) +
				(this.isDot() ? hero.getTotalStat("dmgRat_dot", skill) : 0);
		};
		this.dmgRat_Fact = function() { 
			return this.dmgRat()/enemyLvl*0.015 +
				hero.getTotalStat("dmgRat_pc", skill)/100 +
				(this.isPhysical() ? hero.getTotalStat("dmgRat_physical_pc", skill)/100 : 0) +
				(this.isEnergy() ? hero.getTotalStat("dmgRat_energy_pc", skill)/100 : 0) +
				(this.isMental() ? hero.getTotalStat("dmgRat_mental_pc", skill)/100 : 0) +
				(this.isMelee() ? hero.getTotalStat("dmgRat_melee_pc", skill)/100 : 0) +
				(this.isRanged() ? hero.getTotalStat("dmgRat_ranged_pc", skill)/100 : 0) +
				(this.isArea() ? hero.getTotalStat("dmgRat_area_pc", skill)/100 : 0) +
				(this.isDot() ? hero.getTotalStat("dmgRat_dot_pc", skill)/100 : 0) +
				(this.isSummon() ? hero.getTotalStat("dmgRat_summon_pc", skill)/100 : 0);
		};
		this.dmg_Fact = function() {
			return this.dmgRat_Fact() +
				(this.isPhysical() ? hero.getPhysicalBonusDmg(true) : 0) +
				(this.isEnergy() || this.isMental() ? hero.getMentalBonusDmg(true) : 0) +
				(this.isSummon() ? hero.getSummonBonusDmg(true) : 0);
		};
		this.dmg = function() {
			return this.baseDmg()*(1+this.dmg_Fact())
		};
		this.critRat_Fact = function() {
			var critRat = hero.getTotalStat("critRat", skill) +
				(this.isPhysical() ? hero.getTotalStat("critRat_physical", skill) : 0) +
				(this.isEnergy() ? hero.getTotalStat("critRat_energy", skill) : 0) +
				(this.isMental() ? hero.getTotalStat("critRat_mental", skill) : 0) +
				(this.isMelee() ? hero.getTotalStat("critRat_melee", skill) : 0) +
				(this.isRanged() ? hero.getTotalStat("critRat_ranged", skill) : 0) +
				(this.isArea() ? hero.getTotalStat("critRat_area", skill) : 0);
				
			var critRat_Fact = ((99 * critRat)/(critRat + 60 * enemyLvl + 1)/100);
			critRat_Fact += hero.getTotalStat("critRat_pc", skill)/100;
			critRat_Fact += (this.isPhysical() ? hero.getTotalStat("critRat_physical_pc", skill)/100 : 0);
			critRat_Fact += (this.isEnergy() ? hero.getTotalStat("critRat_energy_pc", skill)/100 : 0);
			critRat_Fact += (this.isMental() ? hero.getTotalStat("critRat_mental_pc", skill)/100 : 0);
			
			return critRat_Fact;
		};
		this.critDmg_Fact = function() {
			var critDmg = hero.getTotalStat("critDmg", skill);
			var critDmg_Fact = ((150 + critDmg/enemyLvl * 0.75)/100);
			critDmg_Fact += hero.getTotalStat("critDmg_pc", skill)/100;
			
			return critDmg_Fact;
		};
		this.brutRat_Fact = function() {
			var brutRat = hero.getTotalStat("brutRat", skill);
			var brutRat_Fact = ((75 * brutRat)/(brutRat + 60 * enemyLvl + 1)/100);
			brutRat_Fact += hero.getTotalStat("brutRat_pc", skill)/100;
			
			return brutRat_Fact;
		};
		this.brutDmg_Fact = function() {
			var critDmg = hero.getTotalStat("critDmg", skill);
			var brutDmg = hero.getTotalStat("brutDmg", skill);
			var brutDmg_Fact = ((300 + ((critDmg+brutDmg)/enemyLvl * 0.75))/100);
			brutDmg_Fact += hero.getTotalStat("brutDmg_pc", skill)/100;
			
			return brutDmg_Fact;
		};
		this.crit_Fact = function() {
			return (1 - this.critRat_Fact()) * 1 + 
					(this.critRat_Fact() - (this.brutRat_Fact() * this.critRat_Fact())) * this.critDmg_Fact() +
					(this.brutRat_Fact() * this.critRat_Fact()) * this.brutDmg_Fact();
		};
		this.dps = function() {
			return this.dmg()*this.crit_Fact()*this.AS() + hero.getProcs()*this.AS()*this.procRate;
		};
	};

	function PassiveEffect(skill, name, value, scope) {
		this.skill = skill;
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
		
		this.getStatValue = function(statName, includeSkillScope) {
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
						total += this.stat.value + (gainPerLevel * (this.skill.totalLvl()-1));
					}
				}
			}
			return total;
		}
	};

	function SpecialEffect(skill, name, statName, scope) {
		this.name = name;
		this.skill = skill;
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
		
		this.getStatValue = function(statName, includeSkillScope) {
			var total = 0;
			if (includeSkillScope || !this.isSkillScope()) {
				if (this.stat.name == statName && (!this.isBuff() || this.isBuffEnabled())) {
					if (this.name == "ARE") { // Arc Reactor Enhancement for Iron Man
						totalSpirit = hero.getTotalStat("spirit", skill) + 60;
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

	function Synergy(name, lvl25Stat, lvl50Stat) {
		this.name = name;
		this.lvl = 0;
		this.lvl25Stat = new Stat(lvl25Stat.name, lvl25Stat.value);
		this.lvl50Stat = new Stat(lvl50Stat.name, lvl50Stat.value);
		this.isActive = function() {
			return (this.lvl > 0);
		};
	}

	function Enchantment(name, slots) {
		this.name = name;
		this.slots = slots;
		this.stats = [];
	}

})
