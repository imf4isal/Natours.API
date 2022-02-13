const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    // normal way of describing type
    // with schema type options objects {}- can be vary for different data types and we can create our own options

    // validator is boolean

    name: {
      type: String,
      required: [true, 'A name must be required.'], //validator
      unique: true,
      trim: true,
      //validator
      maxlength: [40, 'A tour name must have 40 char or less.'],
      minlength: [10, 'A tour name must have 10 char or more.']
      // validate: [validator.isAlpha, 'name should be alphaneumeric.']
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
      required: [true, 'A tour must have difficulty.'],
      //only work for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult.'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // validator work for numbers and date
      min: [1, 'rating must be 1 or above.'],
      max: [5, 'rating must be 5 or less.']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Price must be required.']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount should be less than ({VALue}).'
      }
    },
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
      type: String
      // required: [true, 'Price must be required.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
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

// Document middleware

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// populate

tourSchema.pre(/^find/, function(next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangeAt' });
  next();
});

// embedding, why we should not embed like this

// tourSchema.pre('save', async function(next) {
//   const guidePromises = this.guides.map(async id => User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('document will be saved.....');

//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisecond.`);

  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
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
