const way = require('senseway');
const lib = require('../lib');
const binaryEntropy = require('../binaryEntropy');

const createMoment = (hist, t, pastSize, futureSize) => {
  // Multi-channel moment
  return {
    t: t,
    past: way.before(hist, t, pastSize),
    future: way.after(hist, t, futureSize)
  }
};

const similarity = (a, b, apriori) => {
  // Similarity score between two multi-channel history slices.
  return way.reduce(a, (acc, aq, c, t) => {
    const bq = b[c][t];

    // Alternatives for scoring:
    //   1 - Math.abs(aq - bq);
    //   Math.min(aq, bq);
    const score = 1 - Math.abs(aq - bq);

    // Weight in the info gain.
    // Otherwise full ones or zeros will get huge weight.
    const p = apriori[c][0];
    // Binary entropy function
    const gain = binaryEntropy(p);

    return acc + score * gain;
  }, 0);
};

exports.predict = (hist, context, distance) => {
  // Naive prediction.
  // Assert way.width(hist) === way.width(context)

  const channels = context.length;
  const historySize = hist[0].length;
  const contextSize = Math.min(historySize, context[0].length);
  const futureSize = Math.min(historySize, distance);

  // Trim context to history size
  context = way.last(context, contextSize)

  // We match the context, so the begin can be partial. It might be the best.
  // No reason to include moments where the future is about to be predicted.
  const times = lib.range(-contextSize + 1, historySize - futureSize);
  var moments = times.map(t => {
    return createMoment(hist, t, contextSize, futureSize);
  });

  const apriori = way.mean(hist);

  // Compute weights for each moment based on how well they matched the context
  moments = moments.map(m => {
    const a = Math.max(0, m.t)
    const b = Math.max(0, m.t + contextSize)
    const l = b - a
    const validPast = way.last(m.past, l)
    const validContext = way.last(context, l)
    return Object.assign({
      weight: similarity(validPast, validContext, apriori)
    }, m)
  });

  // Sort to pick the best. Best first.
  const sorted = moments.slice().sort((m0, m1) => {
    return m1.weight - m0.weight;
  });
  const middleAt = Math.floor(sorted.length / 2);
  const median = sorted[middleAt];

  let weightMedian
  if (sorted.length === 0) {
    weightMedian = 0
  } else if (sorted.length % 2 === 0) {
    weightMedian = (sorted[middleAt - 1].weight + sorted[middleAt].weight) / 2
  } else {
    weightMedian = median.weight;
  }

  // Pick weights above median weight. NOTE modifies moments.
  moments.forEach(m => {
    m.weight = Math.max(0, m.weight - weightMedian);
  });

  // Keep only up to n best
  const best = sorted.slice(0, 3);

  const weightSum = lib.arraySum(best.map(m => m.weight));

  const accum = context.map(() => lib.zeros(futureSize));
  const normalized = best.reduce((pred, m, t) => {
    const scale = weightSum > 0 ? m.weight / weightSum : 0;
    return way.add(pred, way.scale(m.future, scale));
  }, accum);

  const maxLikelihood = way.map(normalized, q => Math.round(q));

  return {
    moments: best,
    weights: best.map(m => m.weight),
    probabilities: normalized,
    prediction: maxLikelihood
  };
};
