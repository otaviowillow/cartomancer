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
      var jsonMonster = 'https://api.myjson.com/bins/29rhe';
      var jsonPlayer = 'https://api.myjson.com/bins/47efe';

      $.getJSON(jsonCards, function(response){
          for (var trump of response.trumps) {
            self.trumps.push(trump);
          }
      });
      $.getJSON(jsonMonster, function(response){
          self.$set('monsters', response.monsters);
      });
      $.getJSON(jsonPlayer, function(response){
          self.$set('player', response.player);
      });
    },

    rollDice: function(max, min) {
      return Math.round(Math.random() * (max - min) + min);
    },

    battle: function(monster, level) {
      if(this.firstHit) {
        this.bTarget = this.player;
        this.firstHit = !this.firstHit;
      }

      //Player      
      if(this.bTarget == this.player) {
        this.hit(monster);
      }

      //Monster
      if(this.bTarget == this.monsters) {
        console.log('mon')
      }      
      // Monsters
      // $(this.monsters).each(function(i, monster) {
      //   if(monster.level == level) {
          
      //   }
      // });
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
      this.bTarget.state.onHit = true;

      FullDamage = this.bTarget.attack.base + this.rollDice(this.bTarget.attack.max, this.bTarget.attack.min);
      damage = Math.round(FullDamage - (FullDamage  * victim.armor));

      console.log(this.bTarget.name +' hits '+ victim.name +' for '+ damage)
      this.dealDamage(damage, victim)
    }

  },
  watch: {
    'battleStart': function (val, oldVal) {
      console.log('battle started!')
    },
    'bTarget.state.onHit': function (val, oldVal) {
      console.log(this.bTarget.name, 'fate modifier happens if true', this.bTarget.state.onHit)
    },
    'bTarget.state.isDead': function (val, oldVal) {
      console.log(this.bTarget.name, 'Im dead', this.bTarget.state.isDead)
    },
  }
})