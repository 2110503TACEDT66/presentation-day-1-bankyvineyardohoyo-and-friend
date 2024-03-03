const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserByID,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const {
    protect,
    authorize
} = require('../middlewares/authMiddleware');

router.route("/").get(protect, authorize("admin"), getUsers);

router.route("/:id")
    .get(protect, authorize("admin"), getUserByID)
    .put(protect, updateUser)
    .delete(protect, deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing Users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *         tel:
 *           type: string
 *           description: Telephone number of the user
 *         role:
 *           type: string
 *           description: Role of the user (either "user" or "admin")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of users
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
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags: [Users]
 *     description: Retrieve details of a single user by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - User does not have access to this user
 *       '404':
 *         description: User not found
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update details of a user by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - User does not have access to update this user
 *       '404':
 *         description: User not found
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Delete a user by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '401':
 *         description: Unauthorized - User does not have access to delete this user
 *       '404':
 *         description: User not found
 */
