var vm = new Vue({
  el: '#effects',
  data: {
    commonItems: [],
    specialItems: [],
    traps: [],
    summons: [],

    loot: {},
    trap: {},
    summon: {}
  },

  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/5497z';

      $.getJSON(jsonCards, function(response) {
        for (var effect of response.effects) {
          if(effect.rarity == 'common') {
            self.commonItems.push(effect);
          }

          if(effect.rarity == 'special') {
            self.specialItems.push(effect);
          }
        }

        for (var summon of response.summons) {
          self.summons.push(summon);
        }

        for (var trap of response.traps) {
          self.traps.push(trap);
        }
      });
    },

    randomCommonItem: function() {
      var self = this;
      var itemWeight = [];
      var weighedItems = [];

      console.log(self.commonItems)

      self.commonItems.forEach(function(item) {
        var itemAP = item.zeroAP;

        itemWeight.push(itemAP);
      });

      var totalWeight = itemWeight.reduce((a, b) => a + b, 0);
      var currentItem = 0;

      while (currentItem < self.commonItems.length) { 
        for (i=0; i < itemWeight[currentItem]; i++) 
              weighedItems[weighedItems.length]=self.commonItems[currentItem]
          currentItem++
      }

      var randomItem = Math.floor(Math.random() * totalWeight);

      self.loot = weighedItems[randomItem];
    },

    randomSummon: function() {
      var self = this;
      var commonSummons = [];

      self.summon = self.summons[Math.floor(Math.random() * self.summons.length)];

      console.log(self.summon)
    },

    randomTrap: function() {
      var self = this;

      self.trap = self.traps[Math.floor(Math.random() * self.traps.length)];
    }
  }
})