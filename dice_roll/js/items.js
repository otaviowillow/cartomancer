var vm = new Vue({
  el: '#item',
  data: {
    commonItems: [],
    specialItems: [],
    summons: [],
    weighedItems: [],
    loot: {}
  },

  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/3saaj';

      $.getJSON(jsonCards, function(response) {
        for (var item of response.items) {
          if(item.rarity == 'common') {
            self.commonItems.push(item);
          }

          if(item.rarity == 'special') {
            self.specialItems.push(item);
          }
        }

        for (var summon of response.summons) {
          self.summons.push(summon);
        }
      });
    },

    randomCommonItem: function() {
      var self = this;
      var itemWeight = [];

      self.commonItems.forEach(function(item) {
        var itemAP = item.zeroAP;

        itemWeight.push(itemAP);
      });

      var totalWeight = itemWeight.reduce((a, b) => a + b, 0);
      var currentItem = 0;

      while (currentItem < self.commonItems.length) { 
        for (i=0; i < itemWeight[currentItem]; i++) 
              self.weighedItems[self.weighedItems.length]=self.commonItems[currentItem]
          currentItem++
      }

      var randomItem = Math.floor(Math.random() * totalWeight);

      self.loot = self.weighedItems[randomItem];

      console.log(totalWeight)
    },

    randomSummon: function() {
      var self = this;


    }
  }
})