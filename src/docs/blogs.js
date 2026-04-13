// ==================== BLOG ROUTES ====================

/**
 * @swagger
 * /api/v1.2/blogs/allblogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all blogs (paginated)
 *     description: Returns blogs with likeCount, commentCount, and user info. Supports search, sort, and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Blogs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search on title and content
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *         description: Sort by field (prefix with - for descending)
 *     responses:
 *       200:
 *         description: Paginated list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: integer
 *                 totalBlogs:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     blogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * /api/v1.2/blogs/create:
 *   post:
 *     tags: [Blogs]
 *     summary: Create a new blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "What is RAG?"
 *               content:
 *                 type: string
 *                 example: "RAG AI is a framework that..."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional blog cover image
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Title and Content are required
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1.2/blogs/post/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog fetched successfully
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1.2/blogs/myblogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get current user's blogs
 *     description: Returns user's blogs with likeCount and commentCount. Cached with smart write-through updates.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's blogs fetched successfully
 */

/**
 * @swagger
 * /api/v1.2/blogs/edit/{id}:
 *   patch:
 *     tags: [Blogs]
 *     summary: Update a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1.2/blogs/del-blog/{id}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete a blog
 *     description: Deletes the blog and its Cloudinary image (if any). Invalidates all related caches.
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
 *         description: Blog deleted successfully (image cleaned from Cloudinary)
 *       404:
 *         description: Blog not found
 */
