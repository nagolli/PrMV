//=============================================================================
// Ramza Plugins - Dual Wield
// Ramza_DualWield.js
// v2.30a
//=============================================================================

var Ramza = Ramza || {};
Ramza.DW = Ramza.DW || {};
Ramza.DW.version = 2.30

//=============================================================================
 /*:
 * @plugindesc v2.30a Allows dual wielding actors to deal individual hits with both weapons
 * @author Ramza
 *
 * @param Disable State Id
 * @desc Actors will not attack twice if afflicted with this state. 0 to disable.
 * @default 0
 *
 *
 * @param Dualwield Damage Modifier
 * @desc Multiplier to base ATK value on an actor who is dual wielding or monkeygripping
 * @default 1.0
 * 
 * @param Offhand Damage Modifier
 * @desc Multiplier applied to base ATK on any weapon held in the offhand
 * @default 0.75
 * 
 * @param Twohanded Damage Modifier
 * @desc Multiplier to base ATK value on an actor who is wielding a two-handed weapon.
 * @default 1.5
 * 
 * @help
 * ============================================================================
 * Introduction:
 * ============================================================================
 *
 * Hey thanks for downloading this plugin. For the most part, this is going to
 * be a plug and play addon, very different from the earlier versions, eh?
 * 
 * As newer versions of this come out, more features are being added, but the 
 * default functionality remains plug and play. More advanced users can tweak
 * some of the settings to be more to their liking, of course.
 *
 * ============================================================================
 * Required Plugins:
 * ============================================================================
 *
 * YEP_BattleEngineCore http://yanfly.moe/2015/10/10/yep-3-battle-engine-core/
 *
 * ============================================================================
 * Known compatibility issues:
 * ============================================================================
 * 
 * This plugin should be loaded with your other battle plugins, for maximum 
 * compatibility. If you use YEP_BaseParamControl, this plugin needs to load
 * after it to properly apply attack modifiers for two-handed, dual wielding or
 * offhanding weapons.
 *
 * ============================================================================
 * Note Tag Descriptions: 
 * ============================================================================
 * For weapons:
 * 		<Mainhand>
 *  Denotes the weapon as only being able to be equipped in the mainhand slot.
 * 		<Twohanded>
 *  Weapons with this tag can only be equipped in the mainhand slot, and also 
 *  prevents the use of dualwielding a weapon in the offhand slot.
 * 		<Offhand>
 *  This weapon can only be equipped in the offhand slot, but still cannot be 
 *  equipped if the mainhand weapon is twohanded.
 * For Armor:
 * 		<Offhand>
 *  A shield with this note tag can be equipped while the mainhand is holding a 
 *  twohanded weapon.
 * For Skills:
 * 		<Dualwield Skill>
 *  This skill will split damage between both weapons, as with a normal attack,
 *  however, it requires some action sequence steps to be set up in the skill 
 *  sequence to denote which part of the skill happens twice.
 * 		<Mainhand Skill>
 *  This note tag makes the skill only deal damage from the mainhand weapon 
 *  source. If it hits multiple times, all strikes will be with only the 
 *  mainhand weapon.
 * 		<Offhand Skill>
 *  This note tag makes the skill only strike with the offhand weapon. If it 
 *  hits more than once, all strikes will be with only the offhand weapon. If 
 *  the user does not have an offhand weapon equipped, it will strike with a 
 *  barehand. You will need extra usage tags to prevent the player from using 
 *  this skill if the actor is not dual wielding.
 *
 * ============================================================================
 * Terms of Use:
 * ============================================================================
 * -You may use this plugin in your commercial or non-commercial games, with 
 *  credit to me, Ramza.
 * -You may make changes to the plugin, to add features, or compatibility with
 *  other plugins, for your own personal use.
 * -You may share these changes as their own plugin extension to this one.
 * -You may not directly share modified versions of this plugin publicly.
 * -You may not claim ownership of this plugin.
 * -You must also abide by the terms of use of all Yanfly plugins.
 * ============================================================================
 * What does this plugin do?
 * ============================================================================
 * Thanks for asking. This plugin makes it so that any actor who is dualwield 
 * type will strike twice, once with each weapon, when performing a normal 
 * attack action. Each hit of the dualwield attack will use the weaponsprite of 
 * the equipped item, and show only the battle animation of that weapon. Each 
 * weapon hit will also deal damage as if the other weapon were not equipped.
 * ==*NEW IN V2.12*==
 * Two new notetags have been added for skills, <mainhand skill> and <offhand skill>
 * these notetags will make the skill use the sprite and animation of the designated
 * weapon, as well as ignore the attack value on the opposite weapon. 
 * =NEW IN version 2.10:=
 * The notetag <dualwield skill> can be placed in a skill note box to make it do
 * split damage as if it were a normal attack. Be sure to use the new action 
 * sequence action added below to take advantage of this effect in your skills.
 *
 * two functions can be called via eval in an action 
 * sequence to determine if the current action is a second hit from dual wielding 
 * or not.
 * Game_BattlerBase.prototype.isSecondAttack() is used for regular attacks,
 * Game_BattlerBase.prototype.isSecondSkillHit() is used in other skills.
 * 
 * This plugin also adds a new action sequence tag, which will assist in making 
 * skills that take advantage of dual wielding.
 * 
 *  DUALWIELD ACTION: steps
 * -causes the action sequence to repeat a number of actions equal to 'steps', a 
 * positive number not exceeding the remaining number of actions in the sequence.
 *
 * EXAMPLE:
 * <target action>
 * dualwield action: 6
 * motion attack: user
 * wait: 12
 * attack animation: target
 * wait: 4
 * action effect: target
 * wait for animation
 * </target action>
 *
 * The above sequence will perform all 6 actions below the 'dualwield action' 
 * line twice, once with each weapon. Use this to make animations alternate 
 * between weapons. 
 *
 * Please note that the above tag has no effect if the user of the skill is not
 * dualwielding. Also note that if a skill has the <dualwield skill> tag, but 
 * does not use this action sequence addition, it will not split damage, and 
 * will only attack with the first weapon if it hits multiple times.
 * 
 * The default functionality of dualwielding in RMMV is lackluster. This plugin 
 * will make it just slightly more robust, making it more visually appealing, 
 * and maybe a bit more strategic.
 *
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * v2.30
 * -(revision a) Corrected a new problem introduced by the fix below for the 
 *  odd number of hits skills, where following any action, from anyone, the 
 *  weapon animations of all actors would be reversed permanently, and actors
 *  with only one weapon would have no attack animation at all.
 * -Fixed an issue where custom damage formulas from YEP_DamageCore were not 
 *  being processed correctly, even for non-dual wielding skills.
 * -Fixed an issue where a skill that hit an odd number of times, being used by 
 *  a dual wielding actor, would cause the damage, animations and weapon sprites
 *  of his main and off hands to reverse permanently for all subsequent skills.
 * v2.29
 * -Weapon damage modifiers for dual wielding, two handing, or having a weapon 
 *  in the offhand now properly also apply to bonus parameters added through 
 *  events via the 'change parameters' event command.
 * v2.28
 * -Menu scenes will no longer incorrectly show weapons tagged <offhand> as 
 *  being equippable by a non-dualwielding actor, even if they are of a wtypeId
 *  that could normally be equipped by that actor.
 * -Fixed an issue with action sequences where target.result() was being cleared
 *  early, causing if checks to see if a certain action result occurred would 
 *  always return false.
 * v2.27a:
 * -This plugin will no longer cause the game to crash if YEP_EquipCore is not
 *  being used.
 * v2.27
 * -Fixed a compatibility issue where weapons that set their paramPlus stats 
 *  via note tags on yanfly's equip core plugin would incorrect have those bonus 
 *  params apply to both hands. Bonus params added in this way will now correctly 
 *  apply only to the hand that the weapon is being held in.
 * v2.26
 * -Fixed a bug where damage calculation would always error out for enemies, 
 *  causing them to always deal 0 damage with any skill.
 * v2.25
 * -Fixed a bug where the menu was displaying the correct attack value for a two
 *  handed weapon, but the correct value was not being used in damage 
 *  calculations unless the action being used was a normal attack, a mainhand 
 *  skill or a dualwield skill.
 * -If you make use of YEP_BaseParamControl, this plugin must load after it.
 * -All non-dualwield skills will only utilize the mainhand attack value in 
 *  their damage calculations. Previously it would use the combined total of 
 *  both weapons, with the actor's base attack param.
 * v2.24
 * -Added plugin parameters to adjust damage output on specific weapon types
 * -Modified the way that attack power splitting calculated the off and main 
 *  hand damage to make use of the above plugin parameters.
 * -A weapon tagged with <twohand> will now always prevent an offhand swing,
 *  previous versions required the twohanded weapon to have the disable state 
 *  on it to prevent an offhand barehanded attack.
 * v2.23
 * -Added <Mainhand> tag for weapons. A weapon with this tag cannot be equipped 
 *  in the offhand weapon slot of a dualwield actor
 * -<Offhand> tag now also works with weapons. A weapon with this tag can only be
 *  equipped in the offhand of a dualwield actor. These weapons cannot be equipped
 *  if that actor has a twohanded weapon in their mainhand.
 * -Fixed a bug where the player wouldn't be able to manually equip a shield to 
 *  a dualwield actor, and would only be able to do so using optimization.
 * v2.22
 * -Dual Wield type actors can now equip a shield in their second weapon slot.
 * -Equipment optimization of dual wield actors will no longer leave the offhand
 *  empty if an unequippable shield is held in the inventory.
 * v2.21
 * -Equipment optimization will now properly place an offhand shield into the 
 *  offhand of a non-dualwielding actor who is using a twohanded mainhand weapon
 *  if it is available, rather than attempt to place a non-offhand shield into
 *  the offhand and end up leaving the offhand empty.
 * v2.20
 * -Added two note tags.
 * -Weapons tagged <twohanded> will force-release the item in the offhand when 
 *  equipped. This will also happen to non dualwield type actors as well.
 *  Two-handed weapons cannot be equipped in the second weapon slot.
 * ==NOTE===
 *  Dual Wield actors who have a two handed weapon will still do an attack with
 *  their bare hand as an offhand attack, unless they also have the disable 
 *  state. Best practice is to use this as a passive state on the two hander.
 * ===END NOTE===
 * -Shields tagged <offhand> can be equipped by someone wielding a twohanded 
 *  weapon in their main hand, and will not be removed when one is equipped. 
 * 
 * v2.12b
 * -increased compatibility with action sequences using the <mainhand skill> or
 *  <offhand skill> note tags.
 * v2.12a
 * Corrected an issue where following a mainhand or offhand skill, weapon damages 
 * and animations would be reversed permanently
 * v2.12
 * -Added new skill notetags <mainhand skill> and <offhand skill>, which cause a
 *  skill to only strike once, but only use the attack power and animation (+sprite)
 *  of the equipment in the designated hand.
 * v2.11
 * -Added a plugin parameter to tell the plugin not to automatically duplicate 
 *  the attack action if a certain stateId is present on the actor. This allows
 *  you to have dualwield type actors using non-dualwield type weapons, like a 
 *  two hander, or a sword and shield combo.
 * v2.10
 * -Added notetag support to skills to note them as dual wielding skills.
 * -Added action sequence tag 'dualwield action: x' to cause an action sequence
 *  to repeat the following x commands in the sequence with the offhand weapon.
 * -Added function Game_BattlerBase.prototype.isSecondAttack() which can be called
 *  from the attack action sequence to determine if a weapon swing was a dualwield
 *  attack
 * -Added function Game_BattlerBase.prototype.isSecondSkillHit() which can be 
 *  called from a dualwielding skill to determine if the current hit was a dualwield 
 *  hit.
 * v2.0
 * -Complete rewrite. Old functions from the older version are no 
 *  longer supported.
 * -YEP_WeaponAnimations is no longer a requirement to use this plugin.
 * -Dualwielding one or more barehands is now handled properly.
 * -Plug and play - no changes to be made by the developer to get the plugin 
 *  functioning.
 * ============================================================================
 * end of helpfile
 */
//=============================================================================
// Parameter Variables
//=============================================================================


var Param = PluginManager.parameters('Ramza_DualWield')
Ramza.DWParams = Ramza.DWParams || {};
Ramza.DWParams.disableStateId = Number(Param['Disable State Id']);
Ramza.DWParams.DWModifier = Number(Param['Dualwield Damage Modifier']);
Ramza.DWParams.OHModifier = Number(Param['Offhand Damage Modifier']);
Ramza.DWParams.THModifier = Number(Param['Twohanded Damage Modifier']);

 //intiialize notetags
 
 Ramza.DW.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Ramza.DW.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Ramza._loaded_DW) {
    this.processDWNotetags($dataSkills);
	this.processTHNotetags($dataWeapons);
	this.processOHNotetags($dataArmors);
	this.processMGNotetags($dataStates);
	this.processMGNotetags($dataActors);
	this.processMGNotetags($dataClasses);
	Ramza._loaded_DW = true;
  }
  return true;
};

DataManager.processDWNotetags = function(group) {
	var note1 = /<(?:DUALWIELD SKILL)>/i
	var note2 = /<(?:MAINHAND SKILL)>/i
	var note3 = /<(?:OFFHAND SKILL)>/i
	var note4 = /<(?:TWOHANDED)>/i
    for (var n = 1; n < group.length; n++) {
    var obj = group[n];
	var notedata = obj.note.split(/[\r\n]+/);
    obj._isDWAction = false
	for (var i = 0; i < notedata.length; i++) {
     var line = notedata[i]
     if (line.match(note1)) {
       obj._isDWAction = true;
      }
     if (line.match(note2)) {
       obj._isMHAction = true;
	   mainhandAdd = []
	   mainhandAdd[0] = ['eval', ['user._numAttacks = 0']]
	   mainhandAdd[1] = ['eval', ['user._mainHandLocked = true']]
	   mainhandAdd[2] = ['eval', ['user._mainHandLocked = false']]
	   mainhandAdd[3] = ['eval', ['user._numAttacks = undefined']]
	   obj.setupActions.unshift(mainhandAdd[0], mainhandAdd[1])
	   obj.setupActions.push(mainhandAdd[2])
	   obj.finishActions.push(mainhandAdd[3])
	   }
     if (line.match(note3)) {
       obj._isOHAction = true;
	   offhandAdd = []
	   offhandAdd[0] = ['eval', ['user._numAttacks = 1']]
	   offhandAdd[1] = ['eval', ['user._offHandLocked = true']]
	   offhandAdd[2] = ['eval', ['user._offHandLocked = false']]
	   offhandAdd[3] = ['eval', ['user._numAttacks = undefined']]
	   obj.setupActions.unshift(offhandAdd[0],offhandAdd[1])
	   obj.setupActions.push(offhandAdd[2])
	   obj.finishActions.push(offhandAdd[3])
      }	  
    }
  }
};

DataManager.processTHNotetags = function(group) {
	var note1 = /<(?:TWOHANDED)>/i
	var note2 = /<(?:MAINHAND)>/i
	var note3 = /<(?:OFFHAND)>/i
    for (var n = 1; n < group.length; n++) {
    var obj = group[n];
	var notedata = obj.note.split(/[\r\n]+/);
    for (var i = 0; i < notedata.length; i++) {
     var line = notedata[i]
     if (line.match(note1)) {
       obj._isTwoHanded = true;
      }
     if (line.match(note2)) {
       obj._isMainhand = true;
      }
     if (line.match(note3)) {
       obj._isOffhand = true;
      } 	  
    }
  }
};
DataManager.processOHNotetags = function(group) {
	var note1 = /<(?:OFFHAND)>/i
    for (var n = 1; n < group.length; n++) {
    var obj = group[n];
	var notedata = obj.note.split(/[\r\n]+/);
    for (var i = 0; i < notedata.length; i++) {
     var line = notedata[i]
     if (line.match(note1)) {
       obj._isOffHandItem = true;
      }
 	  
    }
  }
};
DataManager.processMGNotetags = function(group) {
	var note1 = /<(?:MONKEYGRIP)>/i
    for (var n = 1; n < group.length; n++) {
    var obj = group[n];
	var notedata = obj.note.split(/[\r\n]+/);
    for (var i = 0; i < notedata.length; i++) {
     var line = notedata[i]
     if (line.match(note1)) {
       obj._isMonkeyGrip = true;
      }
 	  
    }
  }
};

BattleManager.actionPerformFinish = function() {
    this._logWindow.performActionEnd(this._subject);
    $gameParty.aliveMembers().forEach(function(member) {
      member.spriteReturnHome();
	  member._numAttacks = undefined
    });
    $gameTroop.aliveMembers().forEach(function(member) {
      member.spriteReturnHome();
    });
	
    return true;
};


Game_Actor.prototype.canMonkeyGrip = function(){
/*	if ($dataClasses[this._classId]._isMonkeyGrip || this.actor()._isMonkeyGrip || (this.states().filter(function(monkeygrip){ return monkeygrip._isMonkeyGrip}).length >= 1)){
		//checks if one of either actor, class, or current states are monkeygrip enabled
		return true
	} else {
		//battler doesn't have anything allowing monkeygrip*/
		return false
//	}
}

Game_Actor.prototype.isMonkeyGripping = function(){
	//returns if the battler is actually monkeygripping currently
/*	if (this.canMonkeyGrip && this.equips()[0] && this.equips()[0]._isTwoHanded && this.isArmedOffhand()){
		//battler has a twohanded mainhand weapon, and is armed in the offhand
		return true
	} else {*/
		return false
//	}
}

Game_Actor.prototype.isArmedOffhand = function(){
	actor = this
	if (!actor.equips()[1] || (actor.equips()[1] && actor.equips()[1].etypeId == 1)){
		return true
	} else {
		return false
	}
}

Game_BattlerBase.prototype.isDualWielding = function(){
	//This will return true if the target is dualwield type, and is armed in the offhand, but not true if he is 
	//monkeygripping.
	if (this.isDualWield() && !this.isMonkeyGripping() && !$gameParty.inBattle()){
		//not in battle
		if (!this.equips()[1] || (this.equips()[1] && this.equips()[1].etypeId == 1)){
			//armed in offhand
			return true
		} else {
			//is dual wield type, but either has a shield in offhand or a twohanded weapon
			return false
		}
	} else if (this.isDualWield() && !this.isMonkeyGripping() && $gameParty.inBattle()){
		//in battle
			return true
			//dualwield only returns true in battle if the offhand is armed
	} else {
		return false
	}
}

Game_BattlerBase.prototype.isDualWield = function (){
		if(!$gameParty.inBattle()){
			return this.slotType() === 1;
		} else {
			if (this.slotType() == 1 && (!this.equips()[0] || (this.equips()[0] && !this.equips()[0]._isTwoHanded)) && ((this.equips()[1] && this.equips()[1].etypeId == 1) || !this.equips()[1])){
				return true
			} else {
				return false
			}
		}
}

Game_Actor.prototype.OHCalc = function(){
	var MH = (this.equips()[0]) ? this.equips()[0].params[2] : 0
	if (this.equips()[0] && Imported.YEP_EquipCore) { var PPMH = this.evalParamPlus(this.equips()[0], 2)} else { var PPMH = 0 }
	var offHandModifier = Ramza.DWParams.OHModifier * Ramza.DWParams.DWModifier
	var value = ((this.paramBase(2) + (this.paramPlus(2) - this.addedEquipsParam(2))) * offHandModifier) + (this.addedEquipsParam(2) - (MH+PPMH))
//    var value = (this.paramBase(2) * offHandModifier) + (this.paramPlus(2) - (MH+PPMH));
    value *= this.paramRate(2) * this.paramBuffRate(2);
    var maxValue = this.paramMax(2);
    var minValue = this.paramMin(2);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_Actor.prototype.MHCalc = function(){
	var OH = (this.equips()[1] && this.equips()[1].etypeId == 1) ? this.equips()[1].params[2] : 0
	if (this.equips()[1] && Imported.YEP_EquipCore) { var PPOH = this.evalParamPlus(this.equips()[1], 2)} else { var PPOH = 0 }
	if (this.isMonkeyGripping()){
		//monkeygrip only uses the modifier for dual wielding
		var mainHandModifier = Ramza.DWParams.DWModifier
	} else if (this.equips()[0] && this.equips()[0]._isTwoHanded){
		//Has a twohanded weapon
		var mainHandModifier = Ramza.DWParams.THModifier
	} else if (this.isDualWield() && (!this.equips()[0] || (this.equips()[1] && this.equips()[1].etypeId != 2))){
		//is dual wielding
		var mainHandModifier = Ramza.DWParams.DWModifier
	} else {
		var mainHandModifier = 1
	}
	var value = ((this.paramBase(2) + (this.paramPlus(2) - this.addedEquipsParam(2))) * mainHandModifier) + (this.addedEquipsParam(2) - (OH+PPOH))
    value *= this.paramRate(2) * this.paramBuffRate(2);
    var maxValue = this.paramMax(2);
    var minValue = this.paramMin(2);
    return Math.round(value.clamp(minValue, maxValue));
};

 //overwritten functions 
 	Window_BattleLog.prototype.showActorAttackAnimation = function(subject, targets) {
		this._animationSubject = subject;
	if ((subject._numAttacks === 0 && !subject._mainHandLocked) || subject._offHandLocked == true) {
			this.showNormalAnimation(targets, subject.attackAnimationId2(), false);
		} else {
			this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
		}
	};
  
	Game_BattlerBase.prototype.attackTimesAdd = function() {
	  if (this.isStateAffected(Ramza.DWParams.disableStateId)){
			return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
	  } else if (this.isDualWield() && this.equips()[0] && !this.equips()[0]._isTwoHanded){
			return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 1);
	  } else {
			return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
	  }
    
	};
	
/*	BattleManager.updateActionList = function() {
	for (;;) {
		      this._actSeq = this._actionList.shift();
      if (this._actSeq) {
        if (!this.actionConditionsMet(this._actSeq)) continue;
        var seqName = this._actSeq[0].toUpperCase();
        if (!this.processActionSequenceCheck(seqName, this._actSeq[1])) {
          break;
        }
      } else {
        this._phase = 'phaseChange';
        break;
      }
    }
};
	*/
	
	Game_BattlerBase.prototype.addedEquipsParam = function(paramId) {
		//returns the value of the paramplus amount added specifically by equipment
		var totalParam = this.paramPlus(paramId)
		var equipsParam = 0
		for (i = 0; i < this.equips().length; i++){
			if (this.equips()[i] && this.equips()[i].params[paramId] != 0){
				equipsParam +=  this.equips()[i].params[paramId]
				if (Imported.YEP_EquipCore) { equipsParam += this.evalParamPlus(this.equips()[i], paramId)}
			}
		}
		return equipsParam
	};
	
if (!Imported.YEP_BaseParamControl){
	Ramza.DW.BattlerBase_prototype_param = Game_BattlerBase.prototype.param;
Game_BattlerBase.prototype.param = function(paramId) {
	if (this.isEnemy()){
		return Ramza.DW.BattlerBase_prototype_param.call(this, paramId)
	} else {
		if (paramId != 2) {
			var value = this.paramBase(paramId) + this.paramPlus(paramId);
			value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
			var maxValue = this.paramMax(paramId);
			var minValue = this.paramMin(paramId);
			return Math.round(value.clamp(minValue, maxValue));
		} else {
			var OH = (this.equips()[1] && this.equips()[1].etypeId == 1) ? this.equips()[1].params[2] : 0
		if (this.isMonkeyGripping()){
		//monkeygrip only uses the modifier for dual wielding
			var mainHandModifier = Ramza.DWParams.DWModifier
		} else if (this.equips()[0] && this.equips()[0]._isTwoHanded){
			//Has a twohanded weapon
			var mainHandModifier = Ramza.DWParams.THModifier
		} else if (this.isDualWield() && (!this.equips()[0] || (this.equips()[1] && this.equips()[1].etypeId != 2))){
			//is dual wielding
			var mainHandModifier = Ramza.DWParams.DWModifier
		} else {
			var mainHandModifier = 1
	}
		var value = ((this.paramBase(2) + (this.paramPlus(2) - this.addedEquipsParam(2))) * mainHandModifier) + this.addedEquipsParam(2);
		value *= this.paramRate(2) * this.paramBuffRate(2);
		var maxValue = this.paramMax(2);
		var minValue = this.paramMin(2);
		return Math.round(value.clamp(minValue, maxValue));
		}
	}
};
} else {
	Ramza.DW.BattlerBase_prototype_param = Game_BattlerBase.prototype.param;
	Game_BattlerBase.prototype.param = function(paramId) {
	if (this.isEnemy()){
		return Ramza.DW.BattlerBase_prototype_param.call(this, paramId)
	} else {
		if (paramId != 2) {
			this._baseParamCache = this._baseParamCache || [];
			if (this._baseParamCache[paramId]) return this._baseParamCache[paramId];
			var base = this.paramBase(paramId);
			var plus = this.paramPlus(paramId);
			var paramRate = this.paramRate(paramId);
			var buffRate = this.paramBuffRate(paramId);
			var flat = this.paramFlat(paramId);
			var minValue = this.paramMin(paramId);
			var maxValue = Math.max(minValue, this.paramMax(paramId));
			var a = this;
			var user = this;
			var subject = this;
			var b = this;
			var target = this;
			var s = $gameSwitches._data;
			var v = $gameVariables._data;
			var code = Yanfly.Param.BPCFormula[paramId];
			try {
				var value = eval(code);
			} catch (e) {
				var value = 0;
				Yanfly.Util.displayError(e, code, 'CUSTOM PARAM FORMULA ERROR');
			}
			value = Math.round(value.clamp(minValue, maxValue));
			this._baseParamCache[paramId] = value;
			return this._baseParamCache[paramId];
		} else {
			var OH = (this.equips()[1] && this.equips()[1].etypeId == 1) ? this.equips()[1].params[2] : 0
			if (this.isMonkeyGripping()){
				//monkeygrip only uses the modifier for dual wielding	
				var mainHandModifier = Ramza.DWParams.DWModifier
			} else if (this.equips()[0] && this.equips()[0]._isTwoHanded){
				//Has a twohanded weapon
				var mainHandModifier = Ramza.DWParams.THModifier
			} else if (this.isDualWield() && (!this.equips()[0] || (this.equips()[1] && this.equips()[1].etypeId != 2))){
				//is dual wielding
				var mainHandModifier = Ramza.DWParams.DWModifier
			} else {
				var mainHandModifier = 1
			}			
			this._baseParamCache = this._baseParamCache || [];
			if (this._baseParamCache[paramId]) return this._baseParamCache[paramId];
			var base = (this.paramBase(paramId) * mainHandModifier);
			var plus = ((this.paramPlus(paramId) - this.addedEquipsParam(2)) * mainHandModifier) + this.addedEquipsParam(2);
			var paramRate = this.paramRate(paramId);
			var buffRate = this.paramBuffRate(paramId);
			var flat = this.paramFlat(paramId);
			var minValue = this.paramMin(paramId);
			var maxValue = Math.max(minValue, this.paramMax(paramId));
			var a = this;
			var user = this;
			var subject = this;
			var b = this;
			var target = this;
			var s = $gameSwitches._data;
			var v = $gameVariables._data;
			var code = Yanfly.Param.BPCFormula[paramId];
			try {
				var value = eval(code);
			} catch (e) {
				var value = 0;
				Yanfly.Util.displayError(e, code, 'CUSTOM PARAM FORMULA ERROR');
			}
			value = Math.round(value.clamp(minValue, maxValue));
			this._baseParamCache[paramId] = value;
			return this._baseParamCache[paramId];			
		}
	}
}}


	Game_Action.prototype.evalDamageFormula = function(target) {
		try {
			var item = this.item();
			var a = this.subject();
			var b = target;
			var user = this.subject();
			var subject = this.subject();
			var s = $gameSwitches._data;
			var v = $gameVariables._data;
			var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
			if (((a.isDualWield()) && !a.isStateAffected(Ramza.DWParams.disableStateId)) && (item.id == 1 || item._isDWAction == true)){
				if (item.damage.formula.contains('a.atk')){
					var newformula = item.damage.formula.replace("a.atk", "Ramza.DW.damageCalc(a)")				
				} else if (item.damage.formula.contains('user.atk')){
					var newformula = item.damage.formula.replace("user.atk", "Ramza.DW.damageCalc(a)")
				} else {
					var newformula = item.damage.formula
				}
				var value = Math.max(eval(newformula), 0) * sign;
			} else if (item._isOHAction == true){
				if (item.damage.formula.contains('a.atk')){
					var newformula = item.damage.formula.replace("a.atk", "Ramza.DW.offHandDamageCalc(a)")				
				} else if (item.damage.formula.contains('user.atk')){
					var newformula = item.damage.formula.replace("user.atk", "Ramza.DW.offHandDamageCalc(a)")
				} else {
					var newformula = item.damage.formula
				}
				var value = Math.max(eval(newformula), 0) * sign;
			} else if (item._isMHAction == true){
				if (item.damage.formula.contains('a.atk')){
					var newformula = item.damage.formula.replace("a.atk", "Ramza.DW.mainHandDamageCalc(a)")				
				} else if (item.damage.formula.contains('user.atk')){
					var newformula = item.damage.formula.replace("user.atk", "Ramza.DW.mainHandDamageCalc(a)")
				} else {
					var newformula = item.damage.formula
				}
				var value = Math.max(eval(newformula), 0) * sign;
			} else if (item.damage.custom) {
				eval(item.damage.formula);
				var value = Math.max(value, 0) * sign;
			} else {
				var value = Math.max(eval(item.damage.formula), 0) * sign;
			}
			if (isNaN(value)) value = 0;
			return value;
		} catch (e) {
			return 0;
		}
	};
//---------------------------------------------------------
 //Game Actor
//---------------------------------------------------------
 
 Ramza.DW.performAttack = Game_Actor.prototype.performAttack;
 Game_Actor.prototype.performAttack = function() {
	if (!(this.isDualWield() || this.isMonkeyGripping()) || this.isStateAffected(Ramza.DWParams.disableStateId)){
		Ramza.DW.performAttack.call(this)
	} else {
		this._numAttacks = this._numAttacks || 0
		//showing the correct weapon sprite + animation
		var mainhand = this.equips()[0]
		var offhand = this.equips()[1]
		this.changeEquip(0, null);
		this.changeEquip(1, null);
		if ((this._numAttacks == 0 && !this._offHandLocked) || this._mainHandLocked){
			//first attack action
			this._isSecondAttack = false
		    this.changeEquip(0, mainhand);
			this.changeEquip(1, null);
		} else {
			//second attack action
			this._isSecondAttack = true
			this.changeEquip(0, null);
			this.changeEquip(1, offhand);
		}
		this.performDWAttack()
			//reset all weapons
			this.changeEquip(0, mainhand);
			this.changeEquip(1, offhand);
		
	}
};

Game_Actor.prototype.performDWAttack = function() {
	//attack
	var weapons = this.equips();
	if (!this._offHandLocked && !this.mainHandLocked){
		
		var wtypeId = weapons[this._numAttacks] ? weapons[this._numAttacks].wtypeId : 0;
	} else if (this._offHandLocked){
		//show offhand weapon
		
		
		var wtypeId = weapons[1].wtypeId // : this._wtype;
	} else if (this._mainHandLocked){
		//show mainhand weapon
		
		var wtypeId = weapons[0].wtypeId
	}
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
		this._numAttacks += 1
		if (this._numAttacks > 1){
			this._numAttacks = 0
		}
    }
};

Ramza.DW.damageCalc = function(user){
	//use in place of a.atk in damage formula
	if (!user.isDualWield() && !user.isMonkeyGripping()){
		if (!user.isEnemy()){ 
			return user.MHCalc()
		} else {
			return user.atk
		}
		//return user.atk
	} else {
		if (user._numAttacks == 1){
			//mainhand swing
//			var offhand = (user.equips()[1] != null) ? user.equips()[1].params[2] : 0
			return user.MHCalc()
//			return user.atk - offhand
		} else {
			//offhand swing
//			var mainhand = (user.equips()[0] != null) ? user.equips()[0].params[2] : 0
			return user.OHCalc()
//			return user.atk - mainhand
		}
	}
	
};

Ramza.DW.offHandDamageCalc = function(user){
	//always removes the MH atk value from the damage calculation
	if (!user.isDualWield()){
		return user.atk
	} else {
		user._numAttacks = 0
		if (user._numAttacks == 1){
			//mainhand swing
			var offhand = (user.equips()[1] != null) ? user.equips()[1].params[2] : 0
			return user.MHCalc()
//			return user.atk - offhand
		} else {
			//offhand swing
			var mainhand = (user.equips()[0] != null) ? user.equips()[0].params[2] : 0
			return user.OHCalc()
//			return user.atk - mainhand
		}
	}
	
};

Ramza.DW.mainHandDamageCalc = function(user){
	//always removes the OH atk value from the damage calculation
	if (!user.isDualWield()){
		return user.atk
	} else {
		user._numAttacks = 1
		if (user._numAttacks == 1){
			//mainhand swing
			var offhand = (user.equips()[1] != null) ? user.equips()[1].params[2] : 0
			return user.MHCalc()
//			return user.atk - offhand
		} else {
			//offhand swing
			var mainhand = (user.equips()[0] != null) ? user.equips()[0].params[2] : 0
			return user.OHCalc()
//			return user.atk - mainhand
		}
	}
	
};

Game_BattlerBase.prototype.isSecondAttack = function(){
	if (this.isEnemy()){
		return false;
	} else if (!this._numAttacks || this._numAttacks == 0){
		return true
	} else {
		return false
	}
};

Game_BattlerBase.prototype.isSecondSkillHit = function(){
	if (this.isEnemy()){
		return false;
	} else if (this._numAttacks == 1){
		return true
	} else if (this._numAttacks == 0){
		return false
	} else {
		return false
	}
};

//Battle Manager

Ramza.DW.Process_Action_Sequence = BattleManager.processActionSequence;
 BattleManager.processActionSequence = function(actionName, actionArgs) {
	 // DUAL WIELD ACTION
    if (actionName === 'DUALWIELD ACTION') {
      return this.actionDWAction(actionArgs);
    }
	 // Added Dual Wield setup NEVER USE THIS IN AN AS
	if (actionName === 'SETUP DUALWIELD') {
      return this.actionSetupDWAction();
    }

	return Ramza.DW.Process_Action_Sequence.call(this, actionName, actionArgs)
 };

  BattleManager.actionDWAction = function(actions) {
	if (this._action.subject().isDualWield() && !this._action.subject().isStateAffected(Ramza.DWParams.disableStateId)){
		var actionlist = this._action.item().targetActions
		var addedActions = []
		for (var i = 0; i < actions; i++){
			addedActions[i] = this._actionList[i]
		}
		var setupAdd = []
		setupAdd[0] = ['eval', ['user._numAttacks = 1']]
		addedActions.unshift(setupAdd[0])
		for (i = 0; i < addedActions.length; i++){
			this._actionList.splice((actions+i), 0, addedActions[i])
		}
		return true;
	} else {
		return true;
	}
 };
 
  BattleManager.actionSetupDWAction = function(actions) {
	if (this._action.subject().isDualWield() && !this._action.subject().isStateAffected(Ramza.DWParams.disableStateId)){
		this._action.subject()._numAttacks = (this._action.subject()._numAttacks + 1) || 0
		if (this._action.subject()._numAttacks > 1){
			this._action.subject()._numAttacks = 0
		}
		return true;
	} else {
		return true;
	}
 };		
 
Game_Actor.prototype.bestEquipItem = function(slotId) {
	if (!this.isDualWield()){
		if (slotId == 1) {
			var etypeId = this.equipSlots()[slotId];
			var items = $gameParty.equipItems().filter(function(item) {
				return item.etypeId === etypeId && this.canEquip(item);
			}, this);
			var bestItem = null;
			var bestPerformance = -1000;
			for (var i = 0; i < items.length; i++) {
				var performance = this.calcEquipItemPerformance(items[i]);
				if (performance > bestPerformance && !items[i]._isTwoHanded && (this.equips()[0] && ((this.equips()[0]._isTwoHanded && items[i]._isOffHandItem) || !this.equips()[0]._isTwoHanded))) {
				//if (performance > bestPerformance) {
					bestPerformance = performance;
					bestItem = items[i];
				}
			}
			return bestItem;
		} else {
			var etypeId = this.equipSlots()[slotId];
			var items = $gameParty.equipItems().filter(function(item) {
				return item.etypeId === etypeId && this.canEquip(item);
			}, this);
			var bestItem = null;
			var bestPerformance = -1000;
			for (var i = 0; i < items.length; i++) {
				var performance = this.calcEquipItemPerformance(items[i]);
				if (performance > bestPerformance && ((slotId == 0 && !items[i]._isOffhand) || (slotId != 0))) {
					bestPerformance = performance;
					bestItem = items[i];
				}
			}
			return bestItem;	
		}
	} else {
		if (slotId == 1){
			var etypeId = this.equipSlots()[slotId];
			var items = $gameParty.equipItems().filter(function(item) {
				return ((item.etypeId === etypeId || item.etypeId === 2) && this.canEquip(item));
			}, this);
			var bestItem = null;
			var bestPerformance = -1000;
			for (var i = 0; i < items.length; i++) {
				var performance = this.calcEquipItemPerformance(items[i]);
				if (performance > bestPerformance && !items[i]._isTwoHanded && (this.equips()[0] && ((this.equips()[0]._isTwoHanded && items[i]._isOffHandItem) || !this.equips()[0]._isTwoHanded)) && !items[i]._isMainhand) {
					bestPerformance = performance;
					bestItem = items[i];
				}
			}	
		} else {
			var etypeId = this.equipSlots()[slotId];
			var items = $gameParty.equipItems().filter(function(item) {
				return item.etypeId === etypeId && this.canEquip(item);
			}, this);
			var bestItem = null;
			var bestPerformance = -1000;
			for (var i = 0; i < items.length; i++) {
				var performance = this.calcEquipItemPerformance(items[i]);
				if (performance > bestPerformance && ((slotId == 0 && !items[i]._isOffhand) || (slotId != 0))) {
				//if (performance > bestPerformance) {
					bestPerformance = performance;
					bestItem = items[i];
				}
			}
		}
		return bestItem;			
	}
    
};

Window_EquipItem.prototype.includes = function(item) {
    if (item === null) {
        return true;
    }
	if (this._slotId == 1 && !this._actor.isDualWield() && (this._actor.equips()[0] && this._actor.equips()[0]._isTwoHanded && !item._isOffHandItem)){
		return false
	}
	if (this._slotId == 1 && item.etypeId == 1 && item._isMainhand == true){
		
		return false
	}
	if (this._slotId == 0 && item._isOffhand == true){
		return false
	}	
	if (this._actor && this._actor.isDualWield() && this._slotId == 1 && (item.etypeId == 2)){
		return ((this._actor.canEquip(item) && !item._isTwoHanded) && (!this._actor.equips()[0] || (this._actor.equips()[0] && (!this._actor.equips()[0]._isTwoHanded || item._isOffHandItem)) && !item._isTwoHanded))
	}
	if (this._actor && this._actor.isDualWield() && this._slotId == 1 && (item.etypeId == 1)){
		return ((this._actor.canEquip(item) && !item._isTwoHanded) && (!this._actor.equips()[0] || (this._actor.equips()[0] && (!this._actor.equips()[0]._isTwoHanded || item._isOffHandItem)) && !item._isTwoHanded))
	} else if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
        return false;
    }
	return this._actor.canEquip(item);
};

 Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || (this.equipSlots()[slotId] === item.etypeId || (this.isDualWield() && slotId == 1 && item.etypeId == 2)))) {
        this._equips[slotId].setObject(item);
		if ((this.equips()[0] && this.equips()[0]._isTwoHanded) && (this.equips()[1] && !this.equips()[1]._isOffHandItem)){
			this.tradeItemWithParty(null, this.equips()[1]);
			this._equips[1].setObject(null);
		}
        this.refresh();
    }
};

Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
		for (;;) {
			var slots = this.equipSlots();
			var equips = this.equips();
			var changed = false;
			for (var i = 0; i < equips.length; i++) {
				var item = equips[i];
				if (item && (!this.canEquip(item) || this.cantEquipItem(item, i))) {
				//if (item && (!this.canEquip(item) || this.cantEquipItem(item, i))) {
					if (!forcing)	this.tradeItemWithParty(null, item);
					this._equips[i].setObject(null);
					changed = true;
				}
			}
			if (!changed) break;
		}
};


Game_Actor.prototype.cantEquipItem = function(item, i) {
		var slots = this.equipSlots();
		return item.etypeId !== slots[i] && !(this.isDualWield() && i === 1 && item.etypeId === 2)
//		return null
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId) && (!item._isOffhand || this.isDualWield());
};