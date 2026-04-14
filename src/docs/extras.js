// ==================== BOOKMARK ROUTES ====================

/**
 * @swagger
 * /api/v1.2/bookmarks/toggle:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Toggle bookmark (save/unsave a blog)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blogId]
 *             properties:
 *               blogId:
 *                 type: string
 *                 example: "69ab0952a5fc2744e96bd21a"
 *     responses:
 *       200:
 *         description: Bookmark toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [saved, removed]
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1.2/bookmarks/my:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get my saved/bookmarked blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of bookmarked blogs
 */

/**
 * @swagger
 * /api/v1.2/bookmarks/check/{blogId}:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Check if a blog is bookmarked
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isBookmarked:
 *                   type: boolean
 */

// ==================== FORGOT PASSWORD ====================

/**
 * @swagger
 * /api/v1.2/users/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset OTP
 *     description: Sends a 6-digit OTP to the user's email (valid for 10 minutes)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent if email exists (doesn't reveal email existence)
 */

/**
 * @swagger
 * /api/v1.2/users/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "482910"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 */

// ==================== USER SEARCH ====================

/**
 * @swagger
 * /api/v1.2/users/search:
 *   get:
 *     tags: [Auth]
 *     summary: Search users by name or username
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (min 2 characters)
 *         example: "john"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       profilePicture:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Query too short
 */
