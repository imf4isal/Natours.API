const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    // normal way of describing type
    // with schema type options objects {}- can be vary for different data types and we can create our own options
    name: {
      type: String,
      required: [true, 'A name must be required.'], //validator
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty.']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Price must be required.']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, // only work for string, which all remove all the white space from the begining and in the end
      required: [true, 'Price must be required.']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Price must be required.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual properties does not usually show up and doesnt have query method

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
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
