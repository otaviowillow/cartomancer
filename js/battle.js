Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var battle = new Vue({
  el: '#battle',
  data: {
    trumps: [],
    battleTarget: {},
    latestHitDamage: '',
    firstHit: true,
    battleStart: false,
    battleEnd: false,
    turnStart: false,
    turnEnd: false,

    effectTarget: {},
    cardEffects: [],
    mainEffect: {}
  },

  ready: function() {
    var self = this;

    self.fetchData();
    self.startBattle();
  },

  methods: {
   fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/17xiu';
      var jsonMonster = 'https://api.myjson.com/bins/m10q';
      var jsonPlayer = 'https://api.myjson.com/bins/47efe';

      $.getJSON(jsonCards, function(response){
        for (var trump of response.trumps) {
          self.trumps.push(trump);
        }
      });
      $.getJSON(jsonMonster, function(response){
        self.$set('monster', response.monster);
        self.monster.$set('currentHealth', response.monster.health);
        self.monster.$set('hit', self.hit);
        self.monster.$set('handleEffect', self.handleEffect);
      });
      $.getJSON(jsonPlayer, function(response){
        self.$set('player', response.player);
        self.player.$set('currentHealth', response.player.health);
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
      this.effectTarget = this.player; //TODO: Set who receives buffs
    },

    handleEffect: function(target, effect) {
      procRoll = this.rollDice(0,1);

      console.log(procRoll, effect.proc)

      if(procRoll <= effect.proc) {
        switch(effect.type) {
          case 'heal':
            var targetHeal = target.currentHealth += Math.round((1 * this.latestHitDamage));

            targetHeal <= target.health ? targetHeal : target.currentHealth = target.health;
            console.log(this.effectTarget.name, 'heals to', targetHeal)
            break
          case 'stun':
            console.log('stun!')
            break
          default:
            console.log('no effects')
            console.log(this.mainEffect)
        }
      }
    },

    battle: function() {
      var self = this;

      self.battleStart = false;
      self.turnStart = true;

      if(self.firstHit) {
        self.battleTarget = self.player;
        self.firstHit = !self.firstHit;
      }

      //Player
      setTimeout(function(){
        self.battleTarget = self.player;

        if(!self.battleTarget.state.isDead) {
          self.player.state.onHit = true;
        }
      })

      //Monster
      setTimeout(function(){
        self.battleTarget = self.monster;

        if(!self.battleTarget.state.isDead) {
          self.monster.state.onHit = true;
        }
      }, 500)
      
    },

    dealDamage: function(damage, victim) {
      var self = this;

      if(victim.currentHealth > 0) {
        victim.currentHealth -= damage;
      } 

      if(victim.currentHealth <= 0) {
        victim.currentHealth = 0;
        victim.state.isDead = true;
      }
    },

    hit: function(victim) {
      FullDamage = this.battleTarget.attack.base + this.rollDice(this.battleTarget.attack.max, this.battleTarget.attack.min);
      this.latestHitDamage = Math.round(FullDamage - (FullDamage  * victim.armor));

      this.dealDamage(this.latestHitDamage, victim)

      console.log(this.battleTarget.name +' hits '+ victim.name +' for '+ this.latestHitDamage);
    }
  },
  watch: {
    'battleStart': function (val) {
      if(val == true) {
        console.log('battle started!');
      }
    },
    'battleEnd': function (val) {
      if(val == true) {
        console.log('battle ended!')
      }
    },
    'turnStart': function(val) {
      if(val == true) {
        console.log('Turn Start!')
        this.turnStart = false;
      }
    },
    'turnEnd': function(val) {
      if(val == true) {
        console.log('Turn End!')
        this.turnEnd = false;
      }
    },
    'player.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log('Player hits');

        this.player.hit(this.monster);

        if(this.effectTarget == this.player && this.mainEffect.trigger == 'onHit') {
          this.player.handleEffect(this.effectTarget, this.mainEffect);
        }

        this.player.state.onHit = false;
      }
    },
    'monster.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log('Monster hits');

        this.monster.hit(this.player);

        if(this.effectTarget == this.monster && this.mainEffect.trigger == 'onHit') {
          this.monster.handleEffect(this.effectTarget, this.mainEffect);
        }

        this.monster.state.onHit = false;

        this.turnEnd = true;
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