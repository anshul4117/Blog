// ==================== COMMENT ROUTES ====================

/**
 * @swagger
 * /api/v1.2/comments/blog/{blogId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a blog (paginated)
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
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
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 */

/**
 * @swagger
 * /api/v1.2/comments/create:
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment on a blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blogId, content]
 *             properties:
 *               blogId:
 *                 type: string
 *                 example: "69ab0952a5fc2744e96bd21a"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Great article!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1.2/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 */

// ==================== LIKE ROUTES ====================

/**
 * @swagger
 * /api/v1.2/likes/toggle:
 *   post:
 *     tags: [Likes]
 *     summary: Toggle like on a blog
 *     description: If already liked, unlikes it. If not liked, likes it. Updates cache in real-time.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetId, targetType]
 *             properties:
 *               targetId:
 *                 type: string
 *                 example: "69ab0952a5fc2744e96bd21a"
 *               targetType:
 *                 type: string
 *                 enum: [Blog]
 *                 example: "Blog"
 *     responses:
 *       200:
 *         description: Like toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [liked, unliked]
 */

/**
 * @swagger
 * /api/v1.2/likes/status:
 *   get:
 *     tags: [Likes]
 *     summary: Check like status and count
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Blog]
 *     responses:
 *       200:
 *         description: Like status and count
 */

// ==================== FOLLOW ROUTES ====================

/**
 * @swagger
 * /api/v1.2/users/{id}/follow:
 *   post:
 *     tags: [Follow]
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow
 *     responses:
 *       200:
 *         description: Followed successfully
 *       400:
 *         description: Cannot follow yourself / Already following
 *   delete:
 *     tags: [Follow]
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       400:
 *         description: Not following this user
 */

/**
 * @swagger
 * /api/v1.2/users/{id}/followers:
 *   get:
 *     tags: [Follow]
 *     summary: Get user's followers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of followers
 */

/**
 * @swagger
 * /api/v1.2/users/{id}/following:
 *   get:
 *     tags: [Follow]
 *     summary: Get users that this user follows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of following
 */
