const train = require('./train')
const inferAll = require('./inferAll')
const way = require('senseway')

module.exports = (model, memory, ev) => {
  // Default
  if (!model) {
    model = {
      fieldLength: 5,
      fields: [],
      priors: [],
      prediction: way.fill(memory, 0),
      inspectorChannel: 0,
      trainingInsights: false,
      inferringInsights: false
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH': {
      model = Object.assign({}, model, {
        fieldLength: ev.length
      })
      model = Object.assign({}, model, train(model, memory))
      return Object.assign({}, model, inferAll(model, memory))
    }

    case 'SELECT_INSPECTOR_CHANNEL': {
      return Object.assign({}, model, {
        inspectorChannel: ev.channel
      })
    }

    case 'TOGGLE_TRAINING_INSIGHTS': {
      // Optional boolean parameter ev.toggle
      const curVal = !!model.trainingInsights
      const newVal = typeof ev.toggleTo === 'boolean' ? ev.toggleTo : !curVal
      return Object.assign({}, model, {
        trainingInsights: newVal
      })
    }

    case 'TOGGLE_INFERRING_INSIGHTS': {
      // Optional boolean parameter ev.toggle
      const curVal = !!model.inferringInsights
      const newVal = typeof ev.toggleTo === 'boolean' ? ev.toggleTo : !curVal
      return Object.assign({}, model, {
        inferringInsights: newVal
      })
    }

    default:
      return model
  }
}
