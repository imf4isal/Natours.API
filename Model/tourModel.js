const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  // normal way of describing type
  // with schema type options objects {}- can be vary for different data types and we can create our own options
  name: {
    type: String,
    required: [true, 'A name must be required.'], //validator
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Price must be required.']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 453
// });

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR. Couldnt create document. ', err);
//   });

module.exports = Tour;
