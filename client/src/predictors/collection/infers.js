// This allows workers to require only the infer-part of a predictor.
module.exports = {
  fiftyFifty: require('./fiftyFifty/infer'),
  copyPrevious: require('./copyPrevious/infer'),
  channelMean: require('./channelMean/infer'),
  naiveCorrelator: require('./naiveCorrelator/infer'),
  naiveBayes: require('./naiveBayes/infer'),
  filteredNaiveBayes: require('./filteredNaiveBayes/infer')
}
