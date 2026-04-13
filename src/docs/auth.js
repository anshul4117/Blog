// ==================== AUTH ROUTES ====================

/**
 * @swagger
 * /api/v1.2/users/create:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@gmail.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/v1.2/users/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Returns access and refresh tokens as cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful (tokens set in cookies)
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1.2/users/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Blacklists access token and deletes refresh token
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/v1.2/users/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Uses refresh token cookie to generate a new access token
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/v1.2/users/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user's profile
 *     description: Returns profile with followers/following counts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 followersCount:
 *                   type: integer
 *                 followingCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1.2/users/update-user-profile:
 *   patch:
 *     tags: [Auth]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1.2/users/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password incorrect
 */

/**
 * @swagger
 * /api/v1.2/users/profile-picture:
 *   delete:
 *     tags: [Auth]
 *     summary: Remove profile picture
 *     description: Deletes the image from Cloudinary and resets to default
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture removed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1.2/users/allUsers:
 *   get:
 *     tags: [Auth]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
