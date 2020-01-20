// Slice navigation.
// How the conditioned element is positioned on the field?
// An example for correct slice positioning:
//   Let fieldLen = 3 and t = 0.
//   We expect the field begin at time = -2 and end exclusively at time = 1.
exports.getBegin = (model, t) => t + 1 - model.fieldLength
exports.getEnd = (model, t) => t + 1
