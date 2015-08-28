Vue.filter('rollDice', function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
})

var demo = new Vue({
  el: '#battle',
  data: {
    player: 
    {
      name: "Player 1",
      health: 100,
      armor: 0.20,
      attack: {
        base: 5,
        min: 1,
        max: 4
      }
    },
    trumps:
    {
      name: "The Fool",
      number: "0",
      battleEffect: "confusion",
      legendary: true,
      battleProc: true,
      rare: {
        procChance: 50,
        yellow: {
          goodDescription: "At the end of your Querent phase, look at target opponent hand and pick a card. Separate that card. At the start of target opponents turn, that card is used on owner of the card",
          badDescription: "At the end of your Querent phase, target opponent looks at your hand and picks a card. Separate that card. At the start of target opponents turn, that card is used on owner of the card",
          battle: {
            type: "damage",
            description: "Target gets confused at the start of turn. 60% more damage from confusion hits",
            modifier: 75
          }
        },
        blue: {
          goodDescription: "At the end of your Querent phase, look at target opponent hand and pick a card. Discard that card",
          badDescription: "At the end of your Querent phase, target opponent looks at your hand and picks a card. Discard that card",
          battle: {
            type: "cc",
            description: "Target gets confused at the start of turn. 20% chance to stun on confusion hit",
            modifier: 25
          }
        },
        other: {
          goodDescription: "At the end of your Querent phase, look at target opponent hand and pick a card. Separate that card. Owner of that card may choose to discard a card and buy the separated card. Discard that card before the start of next turn",
          badDescription: "At the end of your Querent phase, target opponent looks at your hand and picks a card. Separate that card. Owner of that card may choose to discard a card and buy the separated card. Discard that card before the start of next turn",
          battle: {
            type: "heal",
            description: "Target gets confused at the start of turn. 40% chance to heal opponent on confusion hit",
            modifier: 50
          }
        },
        common: {
          procChance: 25,
          yellow: {
            goodDescription: "At the end of your Querent phase, pick a random card from target opponents hand. Separate that card. At the start of target opponents turn, that card is used on owner of the card",
            badDescription: "At the end of your Querent phase, target opponent picks a random card from your hand. Separate that card. At the start of target opponents turn, that card is used on owner of the card",
            battle: {
              type: "damage",
              description: "Target gets confused at the start of turn. 30% more damage from confusion hits",
              modifier: 30
            }
          },
          blue: {
            goodDescription: "At the end of your Querent phase, pick a random card from target opponents hand. Separate that card. Discard that card",
            badDescription: "At the end of your Querent phase, target opponent picks a random card from your hand. Discard that card",
            battle: {
              type: "cc",
              description: "Target gets confused at the start of turn. 10% chance to stun on confusion hit",
              modifier: 10
            }
          },
          other: {
            goodDescription: "At the end of your Querent phase, pick a random card from target opponents hand. Separate that card. Owner of that card may choose to discard a card and buy the separated card. Discard that card before the start of next turn",
            badDescription: "At the end of your Querent phase, target opponent picks a random card from your hand. Separate that card. Owner of that card may choose to discard a card and buy the separated card. Discard that card before the start of next turn",
            battle: {
              type: "heal",
              description: "Target gets confused at the start of turn. 20% chance to heal opponent on confusion hit",
              modifier: 20
            }
          }
        }
      }
    },
    monsters: [
      { 
        name: "Main Monster",
        type: "main",
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
        name: "Add 1",
        type: "add",
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
        name: "Add 2",
        type: "add",
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
        name: "Main Monster",
        type: "main",
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
        name: "Add 1",
        type: "add",
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
        name: "Add 2",
        type: "add",
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
    dealDamage: function(targetMonster, damage, target) {
      if(targetMonster.health > 0) {
        target.health -= damage;
      } else {
        targetMonster.health = 0
      }
    },
    playerHit: function(monster) {
      playerFullDamage = this.player.attack.base + this.rollDice(this.player.attack.max, this.player.attack.min);
      playerDamage = Math.round(playerFullDamage - (playerFullDamage * monster.armor));

      this.dealDamage(monster, playerDamage, monster)
    },
    monsterHit: function(monster) {
      monsterFullDamage = monster.attack.base + this.rollDice(monster.attack.max, monster.attack.min);
      monsterDamage = Math.round(monsterFullDamage - (monsterFullDamage * this.player.armor))

      this.dealDamage(monster, monsterDamage, this.player)
    },
    battle: function(monster, selectedLevel) {
      self = this;
      self.playerHit(monster);

      $(self.monsters).each(function(i, monster) {
        if(monster.level == selectedLevel) {
          self.monsterHit(monster)
        } 
      })
    }
  }
})

