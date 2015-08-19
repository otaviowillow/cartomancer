var demo = new Vue({
  el: '#battle',
  data: {
    player: 
    {
      name: 'Player 1',
      health: 100,
      armor: 0.20,
      attack: {
        base: 5,
        min: 1,
        max: 4
      }
    }
    ,
    monsters: [
      { 
        name: 'Main Monster',
        type: 'main',
        level: 2,
        health: 20,
        armor: 0.20,
        attack: {
          base: 3,
          min: 1,
          max: 4
        }
      },
      { 
        name: 'Add 1',
        type: 'add',
        level: 2,
        health: 10,
        armor: 0.20,
        attack: {
          base: 1,
          min: 1,
          max: 1
        }
      },
      { 
        name: 'Add 2',
        type: 'add',
        level: 2,
        health: 10,
        armor: 0.20,
        attack: {
          base: 1,
          min: 1,
          max: 1
        }
      },
      { 
        name: 'Main Monster',
        type: 'main',
        level: 3,
        health: 40,
        armor: 0.20,
        attack: {
          base: 3,
          min: 1,
          max: 4
        }
      },
      { 
        name: 'Add 1',
        type: 'add',
        level: 3,
        health: 10,
        armor: 0.20,
        attack: {
          base: 1,
          min: 1,
          max: 1
        }
      },
      { 
        name: 'Add 2',
        type: 'add',
        level: 3,
        health: 10,
        armor: 0.20,
        attack: {
          base: 1,
          min: 1,
          max: 1
        }
      }
    ]
  },
  methods: {
    rollDice: function(max, min) {
      return Math.round(Math.random() * (max - min) + min);
    },
    playerHit: function(monster) {
      playerFullDamage = this.player.attack.base + this.rollDice(this.player.attack.max, this.player.attack.min);
      playerDamage = Math.round(playerFullDamage - (playerFullDamage * monster.armor))

      if(monster.health > 0) {
        monster.health -= playerDamage;
        console.log(this.player.name, 'hitting monster', playerDamage)
      } else {
        monster.health = 0
      }
    },
    monsterHit: function(monster) {
      monsterFullDamage = monster.attack.base + this.rollDice(monster.attack.max, monster.attack.min);
      monsterDamage = Math.round(monsterFullDamage - (monsterFullDamage * this.player.armor))

      if(monster.health > 0) {
        this.player.health -= monsterDamage;
        console.log(monster.name, 'hitting player', this.player.health)
      } else {
        monster.health = 0;
      }
    },
    battle: function(monster, lvl) {
      self = this;
      self.playerHit(monster);

      $(self.monsters).each(function(i, v) {
        if(v.level == lvl) {
          self.monsterHit(v)
        } 
      })
    }
  }
})

