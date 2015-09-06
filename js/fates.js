Vue.component('fate', {
  template: document.querySelector('#fate-template'),
});

Vue.component('effect', {
  template: document.querySelector('#effect-template'),
});

Vue.component('trump', {
  props: ['activeEffect'],

  template: document.querySelector('#trump-template'),

  data: function() {
    return {
      cardIsOpen: false
    }
  },

  methods: {
    toggleCard: function() {
      this.cardIsOpen = !this.cardIsOpen;
    },
    selectFate: function(e) {
      e.stopPropagation();
      this.activeEffect = e.targetVM.effect;

      console.log(e.targetVM)
    }
  }
});

var trumps = new Vue({
  el: '#trumps',

  data: {
    selectedEffect: '',
  },

  ready: function() {
    this.fetchData();
  },

  methods: {
   fetchData: function() {
      var self = this;
      var json = 'https://api.myjson.com/bins/3a2i6';

      $.getJSON(json, function(response){
          var cardEffects = response.effects.card;
          var querentEffects = response.effects.querent;
          var summonEffects = response.effects.summon;
          var concatEffects = cardEffects.concat(querentEffects, summonEffects);

          self.$set('trumps', response.trumps);
          self.$set('effects', concatEffects);
      });
    }
  }
})