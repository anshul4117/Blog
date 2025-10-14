import { get } from 'mongoose';
import Blog from '../../models/blog';

const getBlogById = async(req,res)=>{
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404)
            .json({
                message: "Blog not found"
            })
        };
        return res.status(200)
        .json({
            message: "Blog fetched successfully",
            blog
        });

    } catch (error) {
        return res.status(500)
        .json({
            message :"Error fetching a blog",
            error: error.message
        })
    }
}
export default getBlogById;