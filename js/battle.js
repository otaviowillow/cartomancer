Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var battle = new Vue({
  el: '#battle',
  data: {
    trumps: [],
    monsters: [],
    bTarget: {},
    firstHit: true,
    battleStart: false,
    battleEnd: false,
    state: {
      isHit: false,
      isDead: false,
    }
  },

  ready: function() {
    var self = this;

    self.battleStart = true;
    self.fetchData();
  },

  methods: {
   fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/17xiu';
      var jsonMonster = 'https://api.myjson.com/bins/3mmqq';
      var jsonPlayer = 'https://api.myjson.com/bins/47efe';

      $.getJSON(jsonCards, function(response){
        for (var trump of response.trumps) {
          self.trumps.push(trump);
        }
      });
      $.getJSON(jsonMonster, function(response){
        for (var monster of response.monsters) {
          self.monsters.push(monster);
          monster.$set('hit', self.hit);
        }
      });
      $.getJSON(jsonPlayer, function(response){
        self.$set('player', response.player);
        self.player.$set('hit', self.hit);
      });
    },

    rollDice: function(max, min) {
      return Math.round(Math.random() * (max - min) + min);
    },

    battle: function(monster, level) {
      var self = this;

      self.battleStart = false;

      if(self.firstHit) {
        self.bTarget = self.player;
        self.firstHit = !self.firstHit;
      }

      //Player      
      if(self.bTarget == this.player) {
        self.player.hit(monster);
        self.bTarget = self.monsters;
      }

      //Monsters
      if(self.bTarget == self.monsters) {
        $(self.monsters).each(function(i, monster) {
          if(monster.level == level && !monster.state.isDead) {
            self.bTarget = monster;
            monster.hit(self.player);
            self.bTarget = self.player;
          } 
        })
      }      
    },

    dealDamage: function(damage, victim) {
      if(victim.health > 0) {
        victim.health -= damage;
      } 

      if(victim.health <= 0) {
        victim.health = 0;
        victim.state.isDead = true;
      }
    },

    hit: function(victim) {
      FullDamage = this.bTarget.attack.base + this.rollDice(this.bTarget.attack.max, this.bTarget.attack.min);
      damage = Math.round(FullDamage - (FullDamage  * victim.armor));

      this.dealDamage(damage, victim)

      //console.log(this.bTarget.name +' hits '+ victim.name +' for '+ damage);
    }

  },
  watch: {
    'battleStart': function (val, oldVal) {
      if(val == true) {
        console.log('battle started!', val)
      }
    },
    'bTarget.state.onHit': function (val, oldVal) {
      console.log(val)
      if(val == true) {
        console.log(this.bTarget.name, 'fate modifier happens if true', this.bTarget.state.onHit)
      }
    },
    'bTarget.state.isDead': function (val, oldVal) {
      console.log(this.bTarget.name, 'Im dead', this.bTarget.state.isDead)
    },
  }
})