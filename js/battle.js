var playerBaseHealth = 100;
var playerBaseAtk = 5;
var playerArmor = 0.20;
var playerMinDmg = 1;
var playerMaxDmg = 4;
var playerHP = playerBaseHealth;
var playerHitTotal;

var maxMonsterHP;
var currentMonsterHP;
var monsterBaseATK;
var monsterARMOR;
var monsterMinDMG;
var monsterMaxDMG;
var monsterHitTOTAL;

var fightingMonster = false;

//Function to roll dice
var rollDice = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Select a dd
$('dl dd').on('click', function() {
  $('dl dd').removeClass('selected');
  $(this).addClass('selected')
})

//Change Player Weapon damage
$('.weapon dd').on('click', function() {
  playerMinDmg = $(this).attr('data-min');
  playerMaxDmg = $(this).attr('data-max');
})

//Change Player Armor percentage
$('.armor dd').on('click', function() {
  playerArmor = $(this).attr('data-armor');
})

//Change Player Health
$('.health dd').on('click', function() {
  playerHealth = parseInt($(this).attr('data-health'));
  playerBaseHealth = playerBaseHealth + playerHealth;
})

// Monster Stats
var monsterData = function(e) {
  maxMonsterHP = parseInt(e.children('strong').text());
  currentMonsterHP = maxMonsterHP;
  monsterMinDMG = parseInt(e.children('span').eq(0).text());
  monsterMaxDMG = parseInt(e.children('span').eq(1).text());
  monsterBaseDMG = parseInt(e.children('span').eq(2).text());
  monsterARMOR = parseInt(e.children('span').eq(3).text());

  console.log(maxMonsterHP, monsterMinDMG, monsterMaxDMG, monsterBaseDMG, monsterARMOR)
}

//Player Hit
var playerHit = function() {
  var playerDMG = rollDice(playerMinDmg, playerMaxDmg) + playerBaseAtk;

  playerTotalDMG =  Math.round(playerDMG - (playerDMG * monsterARMOR));
  currentMonsterHP -= playerTotalDMG;
  $('.turns').append('<li>Player hits for '+ playerTotalDMG +'</li>');
}

// Monsters Hit
var mainHit = function() {
  $('h3').each(function() {
    self = $(this)
    
    monsterData(self);
    if(currentMonsterHP >= 0) {
      var monsterDMG = rollDice(monsterMinDMG, monsterMaxDMG) + monsterBaseDMG;

      monsterTotalDMG =  Math.round(monsterDMG - (monsterDMG * playerArmor));
      $('.turns').append('<li>Main Monster hits for '+ monsterTotalDMG +'</li>');
    }
  })
}

//Battle resolver
$('.monsters h3').on('click', function(e) {
  self = $(this)

  if(self.hasClass('main')) {
    monsterData(self);
  }  

  if(self.hasClass('add')) {
    monsterData(self);
  }

  playerHit();
  mainHit();

  self.children('strong').text(currentMonsterHP);

  if(currentMonsterHP <= 0) {
    self.children('strong').text(0)
  }
})