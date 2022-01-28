// app.use(express.json());
// // app.get('/', (req, res) => {
// //   res.status(200).send('Hello from the server.');
// // });

const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Nothing is found.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newID = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Nothing is found.',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'tour updated..',
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Nothing is found.Invalid tour id.',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}.. ... listening from server......`);
});
