
let practiceTests = [
  { A: "Mike is a professor but not a linguist.", B:"Based on the sentence, how likely is it that he is both?" , Explanation: "Sentences like this have an obvious answer, it directly tells you that he IS NOT BOTH, so the correct response is all the way at the left end of the slider(0%). "},
  { A: "David is a chef and a business owner.", B:'Based on the sentence, how likely is it that he is both?', Explanation: "Like the last example, this sentence also has an obvious answer. It directly tells you that David IS BOTH, so the correct answer is all the way at the right end of slider (100%)." },
  { A: "John is signing or screaming.", B: "Based on the sentence, how likely is it that he is doing both?", Explanation: "To us, it seems pretty unlikely that someone would mean John was doing both based on this sentence, so the best answer is somewhere on the left side of slider."},
  { A: "There is beer in the fridge or the ice-bucket.", B: "Based on the sentence, how likely is it that there is beer in both?", Explanation: "It seems pretty likely that there is beer in both places to us, so the best answer is somewhere on the right side of the slider."},
  { A: "Martha is in love with Alf or Bert.", B: "Based on the sentence, how likely is it that she is in love with both?", Explanation: "It seems unlikely to us that the speaker meant that Martha is in love with both of them, so the best answer is on the left side of the slider."},
  { A: "I’d like flowers or champagne.", B: "Based on the sentence, how likely is it that the speaker would like both?", Explanation: "To us, it seems like they would probably like both, so the best answer is on the right side of the slider. "},
  { A: "Tomorrow, a linguist or a philosopher will come to see me.", B: "Based on the sentence, how likely is it that both will come see the speaker?", Explanation: "For many sentences there may not be an obvious answer, so just respond based on your intuitions."}
]

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

let GIST_LINK;

let group = getRandomIntInclusive(1, 4)
switch (group) {
  case 1: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/bc05b43aa99a79b7e3c41d827fef91ac/raw/8194510796e45533015afa4c1f6a8852a103438d/SynDis_LS1.json';
    break;

  case 2: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/282545dd162718d6833374f5c2793969/raw/72388ccd382b0d18225dbf33562a63ecda4bc635/SynDis_LS2.json';
    break;

  case 3: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/eceb7e68dcbf539ef5f327de09bb7af1/raw/c6f617a9db7779abd92c6c7f0443b9f2053072a5/SynDis_LS3.json';
    break;

  case 4: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/b92612f1bd22bb01c8448ed331c5ee8e/raw/b963a9a0f50e893fa8fe39e3d48852faa6c56ced/SynDis_LS4.json';
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
