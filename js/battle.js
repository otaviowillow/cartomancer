Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var battle = new Vue({
  el: '#battle',
  data: {
    trumps: [],
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
      var jsonMonster = 'https://api.myjson.com/bins/2mx66';
      var jsonPlayer = 'https://api.myjson.com/bins/4zggi';

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
          response.player.onHit = false;
      });
    },

    rollDice: function(max, min) {
      return Math.round(Math.random() * (max - min) + min);
    },

    battle: function(monster, level) {
      // Player
      
      this.player.onHit = true;

      console.log(this.player.onHit)
      
      // Monsters
      $(this.monsters).each(function(i, monster) {
        if(monster.level == level) {
          monster.onHit = true;
          
          //this.target.name = monster.name; 
          
        }
      });
    },

    hit: function() {

    }
    // dealDamage: function(targetMonster, damage, target) {
    //   if(targetMonster.health > 0) {
    //     target.health -= damage;
    //   } else {
    //     targetMonster.health = 0
    //   }
    // },
    // playerHit: function(monster) {
    //   playerFullDamage = this.player.attack.base + this.rollDice(this.player.attack.max, this.player.attack.min);
    //   playerDamage = Math.round(playerFullDamage - (playerFullDamage * monster.armor));

    //   this.dealDamage(monster, playerDamage, monster)
    // },
    // monsterHit: function(monster) {
    //   monsterFullDamage = monster.attack.base + this.rollDice(monster.attack.max, monster.attack.min);
    //   monsterDamage = Math.round(monsterFullDamage - (monsterFullDamage * this.player.armor));

    //   this.dealDamage(monster, monsterDamage, this.player)
    // },
    // battle: function(monster, selectedLevel) {
    //   self = this;
    //   self.battleState.battleStart = true;

    //   self.playerHit(monster);

    //   $(self.monsters).each(function(i, monster) {
    //     if(monster.level == selectedLevel) {
    //       self.monsterHit(monster)
    //       console.log(monster.name)
    //     } 
    //   })
    // }
  },
  watch: {
    'battleStart': function (val, oldVal) {
      console.log('battle started!')
    },
    'player.onHit': function (val, oldVal) {
      console.log(val + ' hits!', oldVal + ' isnt hitting')
    },
  }
})