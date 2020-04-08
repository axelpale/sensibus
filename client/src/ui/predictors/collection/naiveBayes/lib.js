// Slice navigation.
// How the field is positioned on the conditioned element?
// Offset of 0 means that the element is on the oldest row
// and that the field is towards future.
// An example for correct slice positioning:
//   let fieldLen = 3 and fieldOffset = -1 and u.time = 0.
//   We expect the context begin at time = -1 and end at time = 2.
exports.getBegin = (model, t) => t + model.fieldOffset
exports.getEnd = (model, t) => t + model.fieldOffset + model.fieldLength
