// This allows workers to require only the train-part of a predictor.
module.exports = {
  fiftyFifty: require('./fiftyFifty/train'),
  copyPrevious: require('./copyPrevious/train'),
  channelMean: require('./channelMean/train'),
  naiveCorrelator: require('./naiveCorrelator/train'),
  naiveBayes: require('./naiveBayes/train'),
  filteredNaiveBayes: require('./filteredNaiveBayes/train')
}
