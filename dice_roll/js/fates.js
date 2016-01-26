var colorCombo = '';

Vue.filter('replaceX', function (value) {
  return value.replace('X ', this.colorCombo + ' ')
})

var vm = new Vue({
  el: '#fate',
  data: {
    arcanas: [],
    fates: [],
    fateEffects: [],
    mainFate: {},
    hasEffect: false,
    effect: {},
    effectRarity: {},
    description: '',
    colorCode: ''
  },

  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var self = this;
      var jsonCards = 'https://api.myjson.com/bins/5497z';

      $.getJSON(jsonCards, function(response) {
        for (var arcana of response.arcanas) {
          self.arcanas.push(arcana);
        }

        for (var trap of response.traps) {
          self.fateEffects.push(trap);
        }

        for (var effect of response.effects) {
          self.fateEffects.push(effect);
        }

        for (var summon of response.summons) {
          self.fateEffects.push(summon);
        }
      });
    },

    isInArray: function(value, array) {
      return array.indexOf(value) > -1;
    },

    isEmpty: function(obj) {
      return Object.keys(obj).length === 0;
    },

    selectFates: function() {
      var self = this;

      self.fates = [];

      for(i = 0; i < 3; i++) {
        var randomFate = this.arcanas[Math.floor(Math.random() * this.arcanas.length)];
        var rollDice = Math.floor((Math.random() * 2) + 0);

        randomFate['polarity'] = rollDice;

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
        self.colorCode = 'rn';
        self.effectRarity = 'rareNegativeEffect';
      }
      if(karma == 1) {
        self.description = 'commonNegative';
        self.colorCode = 'cn';
        self.effectRarity = 'commonNegativeEffect';
      }
      if(karma == 2) {
        self.description = 'commonPositive';
        self.colorCode = 'cp';
        self.effectRarity = 'commonPositiveEffect';
      }
      if(karma == 3) {
        self.description = 'rarePositive';
        self.colorCode = 'rp';
        self.effectRarity = 'rarePositiveEffect';
      }
    },

    checkColors: function() {
      var self = this;
      var colors = [];
      var counts = {};
      var cCode = {};

      for (var fate of self.fates) {
        colors.push(fate.color);
      }

      colors.forEach(function(x) { 
        counts[x] = (counts[x] || 0)+1; 
      });

      var dominantColors = Object.keys( counts ).map(function ( key ) { return counts[key]; });
      var max = Math.max.apply( null, dominantColors );

      if(max == 1) self.colorCode = self.colorCode + '1'
      if(max == 2) self.colorCode = self.colorCode + '2'
      if(max == 3) self.colorCode = self.colorCode + '3'

      cCode = self.mainFate[self.colorCode];
      self.colorCombo = String(cCode);
    },

    selectMainFate: function() {
      var self = this;

      self.mainFate = this.fates[Math.floor(Math.random() * this.fates.length)];

      self.effect = self.mainFate[self.effectRarity];

      if(!self.isEmpty(self.effect)) {
        self.hasEffect = true;
      } else {
        self.hasEffect = false;
      }
    },

    handleFate: function() {
      this.selectFates();
      this.fatePolarity();
      this.selectMainFate();
      this.checkColors();
    }
  }
})