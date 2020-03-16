const sampler = require('./index')

// Number of iterations
const N = 100000
// Range [0..R] for alpha and beta parameters
const R = 500

// Collect samples to ensure no optimisation.
const samples = []

const beginT = Date.now()
console.log('Benchmark of ' + N + ' iterations begins.')

for (let i = 0; i < N; i += 1) {
  const a = Math.floor(R * Math.random())
  const b = Math.floor(R * Math.random())
  samples.push(sampler.sample(a, b))
}

const endT = Date.now()
const durMs = endT - beginT
const msPerSample = durMs / N

console.log('Computed ' + N + ' samples in ' + durMs + ' ms,')
console.log(msPerSample.toFixed(2) + ' ms per sample.')
