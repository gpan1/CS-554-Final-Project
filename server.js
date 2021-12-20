const app = require('./app')

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});