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

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing massage reservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the reservation
 *         resvDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the reservation
 *         user:
 *           type: string
 *           description: ID of the user making the reservation
 *         massage:
 *           type: string
 *           description: ID of the massage being reserved
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the reservation was created
 */

/**
 * @swagger
 * /massages/{massageId}/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservations for a specific massage
 *     description: Retrieve reservations associated with a specific massage.
 *     parameters:
 *       - in: path
 *         name: massageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the massage to retrieve reservations for.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       '401':
 *         description: Unauthorized - User is not logged in
 *       '500':
 *         description: Internal server error - Unable to retrieve reservations
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     description: Retrieve a list of all reservations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     description: Add a new reservation for a specific massage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: massageId
 *         required: true
 *         description: ID of the massage to reserve
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a single reservation
 *     tags: [Reservations]
 *     description: Retrieve details of a single reservation by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the reservation to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       '401':
 *         description: Unauthorized - User does not have access to this reservation
 *       '404':
 *         description: Reservation not found
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     description: Update details of a reservation by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the reservation to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       '401':
 *         description: Unauthorized - User does not have access to update this reservation
 *       '404':
 *         description: Reservation not found
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     description: Delete a reservation by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the reservation to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '401':
 *         description: Unauthorized - User does not have access to delete this reservation
 *       '404':
 *         description: Reservation not found
 */
