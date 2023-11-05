
let practiceTests = [
  { A: "My grandma has both a cat and a dog.", B: "Based on this first sentence, it's clear that the speaker's grandma has BOTH a cat and a dog, not one or the other, so we'd like you to place the slider at 100%, then click submit.", Explanation: ""},
  { A: "I went to the grocery store, but not to the hardware store.", B: "Based on the above sentence, it's clear that the speaker did NOT go to both stores, so we'd like you to place the slider at 0%.", Explanation: ""},
  { A: "The market is giving away free cookies or brownies today.", B: "In this last sentence it's not clear whether you can get both a free cookie and a free brownie, or just one or the other. The best answer is probably somewhere in between 0% and 100%, so just answer based on your intuitions", Explanation:"Now that you've seen a few examples, try a few practice problems with feedback."},
  { A: "Mike is a professor but not a linguist.", B: "Based on the sentence, how likely is it that he is both?" , Explanation: "Sentences like this have an obvious answer, it directly tells you that he IS NOT BOTH, so the correct response is all the way at the left end of the slider(0%)."},
  { A: "David is a chef and a business owner.", B: "Based on the sentence, how likely is it that he is both?", Explanation: "Like the last example, this sentence also has an obvious answer. It directly tells you that David IS BOTH, so the correct answer is all the way at the right end of slider (100%)."},
  { A: "John is signing or screaming.", B: "Based on the sentence, how likely is it that he is doing both?", Explanation: "To us, it seems pretty unlikely that someone would mean John was doing both based on this sentence, so the best answer is somewhere on the left side of slider, but not necessarily 0%."},
  { A: "There is beer in the fridge or the ice-bucket.", B: "Based on the sentence, how likely is it that there is beer in both?", Explanation: "It seems pretty likely that there is beer in both places to us, so the best answer is somewhere on the right side of the slider, but not necessarily at 100%."},
  { A: "Tomorrow, a linguist or a philosopher will come visit me.", B: "Based on the sentence, how likely is it that both will come visit the speaker?", Explanation: "We're not sure about this one, so just answer based on your intuition."}
]

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

let GIST_LINK;

let group = getRandomIntInclusive(1, 4)
switch (group) {
  case 1: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/bc05b43aa99a79b7e3c41d827fef91ac/raw/b9517ac5361d1d0d8b91ed91198f72957c8bd944/SynDis_LS1.json';
    break;

  case 2: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/282545dd162718d6833374f5c2793969/raw/76056511cadce88f1a1153cf79e7b8fa5bf4478c/SynDis_LS2.json';
    break;

  case 3: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/eceb7e68dcbf539ef5f327de09bb7af1/raw/2e848edc49d6a330932cee29c18e96b36543b2f1/SynDis_LS3.json';
    break;

  case 4: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/b92612f1bd22bb01c8448ed331c5ee8e/raw/36a44ca501e14279670be55c35379ad4d64efadc/SynDis_LS4.json';
    break;
}



let stimuli;
userResult = [];
let sliderMoved = false;
var item;
let originalLength;

init();

function Result(Condition_Item, chance) {
  this.Condition_Item = Condition_Item;
  this.chance = chance;
}


function init() {
  fetch(GIST_LINK)
    .then(results => {
      return results.json();
    })
    .then(data => {
      stimuli = data;
      stimuli = shuffle(stimuli);
      originalLength = stimuli.length;
      console.log(stimuli)
    });

}

function set(target, val) {
  sliderMoved = true;
  // document.getElementById(target).innerHTML = document.getElementById(val).value;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}


function clearError() {
  document.getElementById('error').style = 'display:none';
}
function setError(error) {
  document.getElementById('errorMessage').innerHTML = error;
  document.getElementById('error').style = '';
}
function goToConsent() {
  document.getElementById('startScreen').style = 'display:none';
  document.getElementById('consentForm').style = '';
}
function goToPractice() {
  if (document.getElementById('consentCheck').checked) {
    document.getElementById('consentForm').style = 'display:none';
    document.getElementById('practiceIntro').style = '';
    clearError();
  }
  else {
    setError("Please check the consent box to proceed to the experiment");
    // Show some error thing asking them to check consent form
  }
}
function startPractice() {
  document.getElementById('practiceIntro').style = 'display:none';
  document.getElementById('practiceTestFrame').style = '';
  clearError();
  item = practiceTests.shift();
  document.getElementById('pracRowOne').innerHTML = item.A;
  document.getElementById('pracRowTwo').innerHTML = item.B;


}

function submitPractice() {



  if (!sliderMoved) {
    setError("Please move the slider");
  }
  else {

    document.getElementById('submitPractice').style = 'display:none';
    document.getElementById('showNextPractice').style = '';
    setError(item.Explanation);
  }
}
function showNextPractice() {
  clearError();
  if (practiceTests.length == 0) {
    return endPractice();
  }
  document.getElementById('submitPractice').style = '';
  document.getElementById('showNextPractice').style = 'display:none';
  document.getElementById('pracOne').value = 50;
  sliderMoved = false;
  item = practiceTests.shift();
  document.getElementById('pracRowOne').innerHTML = item.A;
  document.getElementById('pracRowTwo').innerHTML = item.B;
}

function endPractice() {
  document.getElementById('practiceTestFrame').style = 'display:none';
  document.getElementById('realIntro').style = '';
  clearError();
}

function startReal() {

  document.getElementById('realIntro').style = 'display:none';
  document.getElementById('realTestFrame').style = '';
  populateTest();
  clearError();
}

function populateTest() {
  document.getElementById('realOne').value = 50;
  // document.getElementById('valOne').innerHTML = 50;
  sliderMoved = false;
  item = stimuli.shift();
  document.getElementById('realRowOne').innerHTML = item.Sentence;
  document.getElementById('realRowTwo').innerHTML = item.Question;
}

function submitReal() {
  if (stimuli.length == 0) { // check to see if we are out of stimuli
    userResult.push(new Result(item.Condition_Item,
      document.getElementById('realOne').value
    ));
    console.log(userResult)
    console.log(JSON.stringify(userResult))
    proliferate.submit({"trials": userResult})
    document.getElementById('completionScreen').style = '';
    document.getElementById('realTestFrame').style = 'display:none';
  }
  else {
    if (!sliderMoved) {
      setError("Please move the slider");
    }
    else {
      document.getElementById('progressbar').style.width = 100*(originalLength - stimuli.length)/originalLength + "%";
      console.log(item);
      userResult.push(new Result(item.Condition_Item,
        document.getElementById('realOne').value
      ));
      console.log(userResult);
      populateTest();
      clearError();
    }
  }
}
