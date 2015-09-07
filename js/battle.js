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
      var jsonMonster = 'https://api.myjson.com/bins/m10q';
      var jsonPlayer = 'https://api.myjson.com/bins/47efe';

      $.getJSON(jsonCards, function(response){
        for (var trump of response.trumps) {
          self.trumps.push(trump);
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

      if(self.firstHit) {
        self.bTarget = self.player;
        self.firstHit = !self.firstHit;
      }

      //Player      
      if(!self.bTarget.state.isDead) {
        // self.player.state.onHit = true;
        setTimeout(function(){
          self.player.state.onHit = true;
          self.player.hit(self.monster);
        }, 100)

        setTimeout(function(){
          self.monster.state.onHit = true;
          self.monster.hit(self.player);
        }, 500)
      }
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
    'battleStart': function (val, oldVal) {
      if(val == true) {
        console.log('battle started!', val)
      }
    },
    'player.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log('Player hits')
        this.player.state.onHit = false;
        //console.log(this.bTarget.name, 'fate modifier happens if true', this.bTarget.state.onHit)
      }
    },
    'monster.state.onHit': function (val, oldVal) {
      if(val == true) {
        console.log('Monster hits');
        this.monster.state.onHit = false;
        //console.log(this.bTarget.name, 'fate modifier happens if true', this.bTarget.state.onHit)
      }
    },
    'bTarget.state.isDead': function (val, oldVal) {
      //console.log(this.bTarget.name, 'Im dead', this.bTarget.state.isDead)
    },
  }
})