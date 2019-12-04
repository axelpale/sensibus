# Multi-Channel Binary Sequence Predictor

```
const way = require('senseway')
const history = [
  [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
  [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
];

const predictionDistance = 2
const contextSize = 3
const currentContext = way.last(history, contextSize)

const pred = mcbsp.naive.predict(history, currentContext, predictionDistance)
```

Where `pred` equals:

```
{
  probabilities: [
    [0.68, 0.69],
    [0.31, 0.53]
  ],
  prediction: [
    [1, 1],
    [0, 1]
  ]
}
```
