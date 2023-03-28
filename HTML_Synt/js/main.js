
let practiceTests = [
  { A: "Mike is a professor but not a linguist.", B:"Based on the sentence, how possible is it that Mike is both a professor and a linguist?" , Explanation: "To us, after reading the sentence it seems impossible that Mike is both a professor and a linguist. We recommend somewhere on the left end of the slider, maybe near the end."},
  { A: "David is a chef and a business owner.", B:'Based on the sentence, how possible is it that David is both a chef and a business owner?', Explanation: "To us, it seems like this must be the case, so we recommend an answer at the far right end of the slider." },
  { A: "Feel free to take a free T-shirt or hat.", B: "Based on the sentence, how possible is it that the speaker meant you could take both a T-shirt and a hat?", Explanation: "We're not sure about this one, so just answer based on your intuitions."}
]

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

let GIST_LINK;

let group = getRandomIntInclusive(1, 4)
switch (group) {
  case 1: GIST_LINK = 'https://gist.githubusercontent.com/cdfelton/bc05b43aa99a79b7e3c41d827fef91ac/raw/4dbde196c7b411a21a1740fc5c5d720fe11c8775/SynDis_LS1.json';
    break;

  case 2: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/282545dd162718d6833374f5c2793969/raw/e91804c0694db8691ed0493084a2aa74ae49e861/SynDis_LS2.json';
    break;

  case 3: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/eceb7e68dcbf539ef5f327de09bb7af1/raw/edd1284fa5c07175954f7b4cdef52ad5a2432ee1/SynDis_LS3.json';
    break;

  case 4: GIST_LINK ='https://gist.githubusercontent.com/cdfelton/b92612f1bd22bb01c8448ed331c5ee8e/raw/a90e0779c7f6346d5ba716fb078363a555c0020e/SynDis_LS4.json';
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
