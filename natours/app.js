const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const PORT = 3000;
const app = express();

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "Success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;

  if (id > tours.length)
    return res.status(404).json({ status: "Error", message: "Invalid Id" });

  const tour = tours.find((tour) => {
    return tour.id === id;
  });
  res.status(200).json({ status: "Success", data: { tour } });
};

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({ status: "success", data: { tour: "Updated tour" } });
};

const deleteTour = (req, res) => {
  res.status(204).json({ status: "success", data: null });
};

const getAllUsers = (req, res, next) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const getUser = (req, res, next) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const createUser = (req, res, next) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const updateUser = (req, res, next) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const deleteUser = (req, res, next) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};

// ROUTES
app.use('')
const tourRouter = express.Router();
tourRouter.route("/api/v1/tours").get(getAllTours).post(createTour);

tourRouter
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// STARTING SERVER
app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});
