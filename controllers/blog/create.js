import Blog from '../../models/blog.js';

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        if( !title || !content){
            return res.status(400)
            .json({
                message:"Title and Content are required",
            })
        };
        const newBlog = new Blog({ title, content });
        await newBlog.save();
        return res.status(201)
        .json({
            message: "Blog created successfully",
            blog: newBlog
        });


    } catch (error) {
        return res.status(500)
        .json({
            message: "Error creating blog",
            error: error.message
        })
    }
}
export default createBlog;