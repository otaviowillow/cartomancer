Vue.component('trump', {
  template: document.querySelector('#trump-template'),

  // data: function() {
  //    return {
  //       open: true,
  //       fateSelected: false
  //     }
  //   },

  //   methods: {
  //     toggleCard: function() {
  //       if(this.cardIsOpen) {
  //         this.cardIsOpen = false;
  //       } else {
  //         this.cardIsOpen = true;
  //       }
  //     },
  //     openFate: function(e) {
  //       e.stopPropagation();

  //       this.fateSelected = true
  //       console.log(this.name)
  //     }
  //   }
});

var trumps = new Vue({
  el: '#trumps',

  ready: function() {
    this.fetchTrumps();
  },

  methods: {
   fetchTrumps: function() {
      var self = this;
      var json = 'https://gist.githubusercontent.com/otaviowillow/b2d7757b580c2317320e/raw/6d3b161217c43b1fbdc420455c19385317a9519d/gistfile1.txt';

      $.getJSON(json, function(response){
          self.$set('trumps', response);

          console.log(response[0].effects)
      });
    }
  }
})

