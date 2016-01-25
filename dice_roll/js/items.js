var vm = new Vue({
  el: '#item',
  data: {
    items: [],
    weighedItems: [],
    loot: {}
  },

  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/18yhf';

      $.getJSON(jsonCards, function(response) {
        for (var item of response.items) {
          self.items.push(item);
        }
      });
    },

    randomItem: function() {
      var self = this;
      var itemWeight = [];

      self.items.forEach(function(item) {
        var itemAP = item.zeroAP;

        itemWeight.push(itemAP);
      });

      var totalWeight = itemWeight.reduce((a, b) => a + b, 0);
      var currentItem = 0;

      while (currentItem < self.items.length) { 
        for (i=0; i < itemWeight[currentItem]; i++) 
              self.weighedItems[self.weighedItems.length]=self.items[currentItem]
          currentItem++
      }

      var randomItem = Math.floor(Math.random() * totalWeight);

      self.loot = self.weighedItems[randomItem];
    }
  }
})