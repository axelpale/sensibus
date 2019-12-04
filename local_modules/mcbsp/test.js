// Testing

const mcbsp = require('./index');
const way = require('senseway');

const history = [
  [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
  [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
];

const printSlice = (slice) => {
  slice.forEach(channel => console.log(channel));
};

console.log('moment', mcbsp.moment(history, 3, 2, 2));

{
  console.log('');
  let t = history[0].length
  let distance = 2
  let context = way.last(history, 3)
  let pred = mcbsp.naive.predict(history, context, distance);
  console.log('predict', distance);
  console.log('  in context', JSON.stringify(context));
  pred.moments.forEach((mom, index) => {
    let w = JSON.stringify(mom.past) + JSON.stringify(mom.future);
    console.log('  t=' + mom.t + ':', w, 'simil=' + pred.weights[index]);
  });
  console.log('  probabilities:', JSON.stringify(pred.probabilities));
  console.log('  prediction:', JSON.stringify(pred.prediction));
}
