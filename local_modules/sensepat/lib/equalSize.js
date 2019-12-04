module.exports = (pata, patb) => {
  if (pata.value.length !== patb.value.length) return false
  if (pata.mass.length !== patb.mass.length) return false
  if (pata.value[0].length !== patb.value[0].length) return false
  if (pata.mass[0].length !== patb.mass[0].length) return false
  return true
}
