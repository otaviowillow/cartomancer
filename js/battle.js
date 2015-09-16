Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var battle = new Vue({
  el: '#battle',
  data: {
    trumps: [],

    battleTarget: {},
    latestHitDamage: '',
    shield: 0,
    mainProc: false,

    firstHit: true,
    battleStart: false,
    battleEnd: false,
    turnStart: false,
    turnEnd: false,

    effectTarget: {},
    effectOpponent: {},
    cardEffects: [],
    mainEffect: {}
  },

  ready: function() {
    var self = this;

    self.fetchData();
  },

  methods: {
   fetchData: function() {
      var self = this;
      var jsonCards = 'stubs/trumps.json';
      var jsonMonster = 'stubs/monster.json';
      var jsonPlayer = 'stubs/player.json';

      $.getJSON(jsonCards, function(response){
        for (var trump of response.trumps) {
          self.trumps.push(trump);
        }
      });
      $.getJSON(jsonMonster, function(response){
        self.$set('monster', response.monster);
        self.monster.$set('currentHealth', response.monster.health);
        self.monster.$set('shield', self.shield);
        self.monster.$set('hit', self.hit);
        self.monster.$set('handleEffect', self.handleEffect);
      });
      $.getJSON(jsonPlayer, function(response){
        self.$set('player', response.player);
        self.player.$set('currentHealth', response.player.health);
        self.player.$set('shield', self.shield);
        self.player.$set('hit', self.hit);
        self.player.$set('handleEffect', self.handleEffect);
      });
    },

    rollDice: function(max, min) {
      var roll = Math.random() * (max - min) + min;

      return Math.round(roll * 10) / 10;
    },

    startBattle: function() {
      this.battleStart = true;
    },

    assembleEffects: function(e) {
      this.cardEffects = e.targetVM.effects;
      this.mainEffect = this.cardEffects[0];
      this.secondaryEffect = this.cardEffects[1];

      this.effectTarget = this.player; //TODO: Set who receives buffs
      this.effectOpponent = this.monster; //TODO: Set who is opponent
      this.effectTarget.$set('mainProc', this.mainProc)
    },

    handleEffect: function(target, effect) {
      var self = this;

      procRoll = self.rollDice(0,1);

      if(procRoll <= effect.proc) {
        this.effectTarget.mainProc = true;

        switch(effect.type) {
          case 'confusion':
            target.state.isConfused = true;
            console.info(target.name, 'is confused', target.state.isConfused)
            target.hit(target)
            this.battleTarget.state.onHit = false;
            break;
          case 'heal':
            var targetHeal = target.currentHealth += Math.round(effect.modifier[0] * target.health);

            targetHeal;
            console.info('holy novaaaa oh holy novaaaa', targetHeal)
            break;
          case 'shield':
            target.shield = Math.round(effect.modifier[0] * target.health);

            console.info('shields up!', target.shield);
            break;
          case 'doubleDamage':
            target.hit(self.effectOpponent, effect.modifier[0])

            console.info('spinning up', this.latestHitDamage)
            break;
          case 'reduceArmor':
            self.effectOpponent.armor -= effect.modifier[0];

            console.info('reduce armor', self.effectOpponent.armor)
            break;
          case 'extraDamage':
            console.info(self.mainEffect.type, 'triggers extra damage')
            break;
          default:
            console.log('no effects')
        }
      }
      
    },

    battle: function() {
      var self = this;

      self.battleStart = false;
      self.turnStart = true;
      self.effectTarget.mainProc = false;

      if(self.firstHit) {
        self.battleTarget = self.player;
        self.firstHit = !self.firstHit;
      }

      //Player
      setTimeout(function(){
        self.battleTarget = self.player;
        self.battleOpponent = self.monster;

        if(!self.battleTarget.state.isDead) {
          self.player.state.onHit = true;
        }
      })

      //Monster
      setTimeout(function(){
        self.battleTarget = self.monster;
        self.battleOpponent = self.player;

        if(!self.battleTarget.state.isDead && !self.player.state.onHit) {
          self.monster.state.onHit = true;
          self.turnEnd = true;
        }
      }, 500)
      
    },

    dealDamage: function(damage, victim, fDamage) {
      var self = this;

      if(victim.currentHealth > 0 && victim.shield <= 0) {
        victim.currentHealth -= damage;
      }

      if(victim.shield > 0) {
        victim.shield -= fDamage;
      }

      if(victim.currentHealth <= 0) {
        victim.currentHealth = 0;
        victim.state.isDead = true;
      }
    },

    hit: function(victim, attackModifier, defenseModifier) {
      fullDamage = Math.round(this.battleTarget.attack.base + this.rollDice(this.battleTarget.attack.max, this.battleTarget.attack.min));
      this.latestHitDamage = Math.round(fullDamage - (fullDamage  * victim.armor));

      if(attackModifier > 0) {
        this.latestHitDamage = Math.round((fullDamage - (fullDamage  * victim.armor)) * attackModifier);
      }

      this.dealDamage(this.latestHitDamage, victim, fullDamage)

      console.log(this.battleTarget.name +' hits '+ victim.name +' for '+ this.latestHitDamage);
    }
  },
  watch: {
    'battleStart': function (val) {
      if(val == true) {
        console.log('battle started!');

        if(this.mainEffect.trigger == 'battleStart') {
          this.effectTarget.handleEffect(this.effectTarget, this.mainEffect, this.secondaryEffect);
        }
      }
    },
    'battleEnd': function (val) {
      if(val == true) {
        console.log('battle ended!')
      }
    },
    'turnStart': function(val) {
      if(val == true) {
        console.log('Turn Start!');

        if(this.mainEffect.trigger == 'turnStart') {
          this.effectTarget.handleEffect(this.effectTarget, this.mainEffect);
        }

        if(this.secondaryEffect.trigger == 'turnStart') {
          this.effectTarget.handleEffect(this.effectTarget, this.secondaryEffect);
        }

        this.turnStart = false;
      }
    },
    'turnEnd': function(val) {
      if(val == true) {
        console.log('Turn End!');

        this.turnEnd = false;
      }
    },
    'effectTarget.currentHealth': function(val) {
      if(val > this.effectTarget.health) {
        this.effectTarget.currentHealth = this.effectTarget.health;

        if(this.secondaryEffect.trigger == 'fullHealth') {
          this.effectTarget.handleEffect(this.effectTarget, this.secondaryEffect);
        }
      }
    },
    'effectTarget.mainProc': function (val) {
      if(val == true && this.secondaryEffect.trigger == 'mainProc') {
        console.info('main procced');

        console.log(this.effectTarget.mainProc)
        this.effectTarget.handleEffect(this.effectTarget, this.secondaryEffect);
      }
    },
    'battleTarget.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log(this.battleTarget.name ,'hits');

        if(this.mainEffect.trigger == 'onHit' && this.effectTarget.name == this.battleTarget.name) {
          this.effectTarget.handleEffect(this.effectTarget, this.mainEffect);
        }

        if(!this.battleTarget.state.isConfused) {
          this.battleTarget.hit(this.battleOpponent);
          this.battleTarget.state.onHit = false;
        }
      }
    },
    'battleTarget.state.isDead': function (val, oldVal) {
      if(val == true) {
        console.log(this.battleTarget.name, 'is dead');
        this.battleEnd = true;
      }
    },
  }
})