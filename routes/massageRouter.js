const express = require("express");
const router = express.Router();
const reservationRouter = require("./reservationRouter");

const {
    getMassages,
    getMassageByID,
    createMassage,
    updateMassage,
    deleteMassage
} = require("../controllers/massageController");

const {
    protect,
    authorize
} = require("../middlewares/authMiddleware");

router.route("/")
    .get(getMassages)
    .post(protect, authorize("admin"), createMassage);

router.route("/:id")
    .get(getMassageByID)
    .put(protect, authorize("admin"), updateMassage)
    .delete(protect, authorize("admin"), deleteMassage);

// re-Routing to reservation router
router.use("/:massageId/reservations", reservationRouter);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Massages
 *   description: API for managing Massage Shop
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Massage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the massage
 *         name:
 *           type: string
 *           description: Name of the massage
 *         address:
 *           type: string
 *           description: Address of the massage
 *         province:
 *           type: string
 *           description: Province of the massage
 *         tel:
 *           type: string
 *           description: Telephone number of the massage
 *         openTime:
 *           type: string
 *           description: Opening time of the massage
 *         closeTime:
 *           type: string
 *           description: Closing time of the massage
 */

/**
 * @swagger
 * /massages:
 *   get:
 *     summary: Get all massages
 *     tags: [Massages]
 *     description: Retrieve a list of all massages
 *     responses:
 *       '200':
 *         description: A list of massages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     prev:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                     next:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Massage'
 *   post:
 *     summary: Create a new massage
 *     tags: [Massages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Massage'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Massage'
 */

/**
 * @swagger
 * /massages/{id}:
 *   get:
 *     summary: Get a single massage
 *     tags: [Massages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the massage to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Massage'
 *       '404':
 *         description: Massage not found
 *   put:
 *     summary: Update a massage
 *     tags: [Massages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the massage to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Massage'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Massage'
 *       '404':
 *         description: Massage not found
 *   delete:
 *     summary: Delete a massage
 *     tags: [Massages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the massage to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Massage not found
 */
