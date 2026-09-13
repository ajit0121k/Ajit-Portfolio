import BlogPost from '../models/BlogPost.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (filters = {}) => {
  const { status, category, tag, search, page = 1, limit = 20 } = filters;
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (category) query.category = category;
  if (tag) query.tags = { $in: [tag] };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limitNum),
    BlogPost.countDocuments(query),
  ]);

  return { posts, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 };
};

export const getPublished = async (filters = {}) => {
  return getAll({ ...filters, status: 'published' });
};

export const getBySlug = async (slug) => {
  const post = await BlogPost.findOne({ slug, status: 'published' });
  if (!post) throw ApiError.notFound('Blog post not found');
  return post;
};

export const getById = async (id) => {
  const post = await BlogPost.findById(id);
  if (!post) throw ApiError.notFound('Blog post not found');
  return post;
};

export const create = async (data) => {
  const post = new BlogPost(data);
  await post.save();
  return post;
};

export const update = async (id, data) => {
  const post = await BlogPost.findById(id);
  if (!post) throw ApiError.notFound('Blog post not found');

  // Save version snapshot
  if (post.status === 'published' || post.versions?.length) {
    post.versions.push({
      data: post.toObject(),
      savedAt: new Date(),
      version: (post.versions?.length || 0) + 1,
    });
    if (post.versions.length > 10) {
      post.versions = post.versions.slice(-10);
    }
  }

  Object.assign(post, data);
  if (data.status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }

  await post.save();
  return post;
};

export const deleteBlog = async (id) => {
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) throw ApiError.notFound('Blog post not found');
  return post;
};
export { deleteBlog as delete };

export const updateStatus = async (id, status) => {
  const post = await BlogPost.findById(id);
  if (!post) throw ApiError.notFound('Blog post not found');

  post.status = status;
  if (status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }
  await post.save();
  return post;
};

export const getTags = async () => {
  const tags = await BlogPost.distinct('tags', { status: 'published' });
  return tags.filter(Boolean);
};

// Aliases matching blogController method names
export const getPublishedPosts = getPublished;
export const getAllPosts = getAll;
export const getPostBySlug = getBySlug;
export const getPostById = getById;
export const createPost = create;
export const updatePost = update;
export const deletePost = deleteBlog;
export const updatePostStatus = updateStatus;

