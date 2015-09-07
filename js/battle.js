Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var battle = new Vue({
  el: '#battle',
  data: {
    trumps: [],
    bTarget: {},
    firstHit: true,
    battleStart: false,
    battleEnd: false,
    turnStart: false,
    turnEnd: false
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
      var jsonMonster = 'https://api.myjson.com/bins/m10q';
      var jsonPlayer = 'https://api.myjson.com/bins/47efe';

      $.getJSON(jsonCards, function(response){
        for (var trump of response.trumps) {
          self.trumps.push(trump);
          self.$set('effects', trump.effects);
        }
      });
      $.getJSON(jsonMonster, function(response){
        self.$set('monster', response.monster);
        self.monster.$set('hit', self.hit);
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
      self.turnStart = true;

      if(self.firstHit) {
        self.bTarget = self.player;
        self.firstHit = !self.firstHit;
      }

      //Player
      setTimeout(function(){
        self.bTarget = self.player;

        if(!self.bTarget.state.isDead) {
          self.player.state.onHit = true;
        }
      })

      //Monster
      setTimeout(function(){
        self.bTarget = self.monster;

        if(!self.bTarget.state.isDead) {
          self.monster.state.onHit = true;
        }
      }, 500)
      
    },

    dealDamage: function(damage, victim) {
      var self = this;

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

      console.log(this.bTarget.name +' hits '+ victim.name +' for '+ damage);
    }
  },
  watch: {
    'battleStart': function (val) {
      if(val == true) {
        console.log('battle started!')
      }
    },
    'battleEnd': function (val) {
      if(val == true) {
        console.log('battle end!')
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

        this.player.state.onHit = false;
      }
    },
    'monster.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log('Monster hits');

        this.monster.hit(this.player);

        this.monster.state.onHit = false;

        this.turnEnd = true;
      }
    },
    'bTarget.state.isDead': function (val, oldVal) {
      if(val == true) {
        console.log(this.bTarget.name, 'is dead');
        this.battleEnd = true;
      }
    },
  }
})