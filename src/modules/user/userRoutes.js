const express = require("express");

const authorize = require("../../middlewares/roleMiddleware");

const { protect } = require("../../middlewares/authMiddleware");
const { upload } = require("../../config/uploadConfig");
const userController = require("./userController");

const {
  validateAddRole,
  validateRemoveRole,
  validateCreateUser,
  validateUpdateUser,
} = require("./userValidation");

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users. Accessible by admin, superadmin, and teacher.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  protect,
  authorize("admin", "superadmin", "teacher"),
  userController.getAllUsers,
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     description: Returns a single user by id. Accessible by admin, superadmin, and teacher.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  protect,
  authorize("admin", "superadmin", "teacher"),
  userController.getUserById,
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create user
 *     description: Creates a new user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *               phoneNumber:
 *                 type: string
 *                 example: "09123456789"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1995-01-01
 *               about:
 *                 type: string
 *                 example: About me...
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: User profile image
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Email already exists
 */
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("profileImage"),
  validateCreateUser,
  userController.createUser,
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     description: Updates an existing user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     description: Updates an existing user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *               phoneNumber:
 *                 type: string
 *                 example: "09123456789"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1995-01-01
 *               about:
 *                 type: string
 *                 example: Updated about text
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  upload.single("profileImage"),
  validateUpdateUser,
  userController.updateUser,
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Deletes a user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  userController.deleteUser,
);

/**
 * @openapi
 * /users/{id}/role/add:
 *   patch:
 *     summary: Add role to user
 *     description: Adds a role to a user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleRequest'
 *     responses:
 *       200:
 *         description: Role added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/role/add",
  protect,
  authorize("admin", "superadmin"),
  validateAddRole,
  userController.addRole,
);

/**
 * @openapi
 * /users/{id}/role/remove:
 *   patch:
 *     summary: Remove role from user
 *     description: Removes a role from a user. Accessible by admin and superadmin only.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleRequest'
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/role/remove",
  protect,
  authorize("admin", "superadmin"),
  validateRemoveRole,
  userController.removeRole,
);

module.exports = router;
