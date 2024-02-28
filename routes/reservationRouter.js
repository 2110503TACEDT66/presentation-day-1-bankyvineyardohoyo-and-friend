const express = require("express");
const router = express.Router({ mergeParams: true }); // Enable params merging

const {
    getReservations,
    getReservationByID,
    createReservation,
    updateReservation,
    deleteReservation
} = require("../controllers/reservationController");

const {
    protect
} = require("../middlewares/authMiddleware");

router.route("/")
    .get(protect, getReservations)
    .post(protect, createReservation);

router.route("/:id")
    .get(protect, getReservationByID)
    .put(protect, updateReservation)
    .delete(protect, deleteReservation);

module.exports = router;