const way = require('senseway')

module.exports = (fields, priors, varC, varT, condition, condC, condT) => {
  // Get probability at (varC, varT) given
  // condition at (condC, condT).
  // If such probability is outside of fields, undefined is returned.
  //
  if (condition === 0) {
    return // undefined
  }

  const fieldLength = way.len(fields[0][1].prob)
  const varOffset = varT - condT // == pair length - 1

  if (Math.abs(varOffset) >= fieldLength) {
    return // undefined
  }

  if (varOffset <= 0) {
    // Conditional probability can be found directly from prob field
    const probField = fields[condC][condition].prob
    const adjustedVarTime = 1 - fieldLength + varOffset
    const condProb = probField[varC][adjustedVarTime]
    return condProb
  } // else

  // Conditional probability not directly in prob field.
  // Conditional probability must be computed via bayes theorem.
  // P(V=1|C=c) = P(C=c|V=1) P(V=1) / P(C=c)
  const probField = fields[varC]['1'].prob
  // Position of condition P(C|V) in var's field.
  // Note that P(V|V) at t=L-1, where L is field length.
  // Ex 1. Let L=2, Voff=1. Then P(C|V) in V's field at t=0.
  // Ex 2. Let L=5, Voff=3. Then P(C|V) in V's field at t=1
  const adjustedCondTime = fieldLength - 1 - varOffset
  const condProb = probField[condC][adjustedCondTime]

  if (condition > 0) {
    // P(C=1|V=1)
    return condProb * priors[varC] / priors[condC]
  } // else condition < 0
  return (1 - condProb) * priors[varC] / (1 - priors[condC])
}
