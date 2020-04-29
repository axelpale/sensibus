const sampler = require('./')
const alpha = 8
const beta = 8

const bins = [0, 0, 0, 0, 0]
const iterations = 1000

const printBar = n => {
  const m = 80 * n / iterations
  const bar = '\u25A0'.repeat(m)
  console.log(bar + ' ' + n)
}

for (let i = 0; i < iterations; i += 1) {
  const p = sampler.sample(alpha, beta)
  const j = sampler.bin(p, bins.length)
  bins[j] += 1
}

console.log('Beta sampling')
bins.forEach(printBar)

// Compare to directly sampling the captured distribution

const altBins = [0, 0, 0, 0, 0]

for (let i = 0; i < iterations; i += 1) {
  let xs = 0
  let ys = 0
  for (let j = 0; j < alpha + beta; j += 1) {
    const x = Math.random() * (alpha + beta)
    if (x < alpha) {
      xs += 1
    } else {
      ys += 1
    }
  }
  const p = xs / (xs + ys)
  const k = sampler.bin(p, altBins.length)
  altBins[k] += 1
}

console.log('Direct sampling')
altBins.forEach(printBar)
