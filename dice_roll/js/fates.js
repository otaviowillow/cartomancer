var vm = new Vue({
  el: '#fate',
  data: {
    trumps: [],
    fates: [],
    mainFate: {},
    description: '',
  },

  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/4epjd';

      $.getJSON(jsonCards, function(response) {
        for (var trump of response.trumps) {
          self.trumps.push(trump);
        }
      });
    },

    isInArray: function(value, array) {
      return array.indexOf(value) > -1;
    },

    selectFates: function() {
      var self = this;

      self.fates = [];

      for(i = 0; i < 3; i++) {
        var randomFate = this.trumps[Math.floor(Math.random() * this.trumps.length)];
        var rollDice = Math.floor((Math.random() * 2) + 0);

        randomFate["polarity"] = rollDice;

        !self.isInArray(randomFate, self.fates) ? self.fates.push(randomFate) : i--
      }
    },

    fatePolarity: function() {
      var self = this;
      var karma = 0;

      for (var fate of self.fates) {
        karma += fate.polarity;
      }

      if(karma == 0) {
        self.description = 'rareNegative';
      }
      if(karma == 1) {
        self.description = 'commonNegative';
      }
      if(karma == 2) {
        self.description = 'commonPositive';
      }
      if(karma == 3) {
        self.description = 'rarePositive';
      }
    },

    selectMainFate: function() {
      var self = this;
      var validFates = [];

      self.mainFate = this.fates[Math.floor(Math.random() * this.fates.length)];
    },

    handleFate: function() {
      this.selectFates();
      this.fatePolarity();
      this.selectMainFate();
    }
  }
})