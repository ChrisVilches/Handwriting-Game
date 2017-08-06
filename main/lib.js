module.exports.calculateScore = function(lowest, highest, easiness, indexCorrect){

  if(lowest > highest || easiness < 1 || indexCorrect < 0){
    throw new RangeError("Incorrect parameters");
  }

  if(indexCorrect > easiness - 1){
    return lowest;
  }
  var diff = highest - lowest;
  var partition = diff/easiness;
  var score = highest;
  score -= partition * indexCorrect;
  return Math.floor(score);
}
