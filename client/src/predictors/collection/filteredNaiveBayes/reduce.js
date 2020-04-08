module.exports = (model, memory, ev) => {
  // Default
  if (!model) {
    model = {
      fieldLength: 5,
      fields: [],
      priors: [],
      inspectorChannel: 0,
      trainingInsights: false,
      inferringInsights: false
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH': {
      return Object.assign({}, model, {
        fieldLength: ev.length
      })
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
