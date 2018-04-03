const redis = require('redis')
const client = redis.createClient()

// Log any errors
client.on('error', function(error) {
  console.log('Error:')
  console.log(error)
})

module.exports = client
