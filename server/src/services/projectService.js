import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (filters = {}) => {
  const { status, featured, pinned, search, page = 1, limit = 20 } = filters;
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (featured !== undefined && featured !== '') query.featured = featured === 'true' || featured === true;
  if (pinned !== undefined && pinned !== '') query.pinned = pinned === 'true' || pinned === true;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { technologies: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(query).sort({ pinned: -1, order: 1, createdAt: -1 }).skip(skip).limit(limitNum),
    Project.countDocuments(query),
  ]);

  return { projects, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 };
};

export const getPublished = async (filters = {}) => {
  return getAll({ ...filters, status: 'published' });
};

export const getBySlug = async (slug) => {
  const project = await Project.findOne({ slug, status: 'published' });
  if (!project) throw ApiError.notFound('Project not found');
  return project;
};

export const getById = async (id) => {
  const project = await Project.findById(id);
  if (!project) throw ApiError.notFound('Project not found');
  return project;
};

export const create = async (data) => {
  const project = new Project(data);
  await project.save();
  return project;
};

export const update = async (id, data) => {
  const project = await Project.findById(id);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.status === 'published' || project.versions?.length) {
    const currentVersionNum = (project.versions?.length || 0) + 1;
    project.versions.push({
      data: project.toObject(),
      savedAt: new Date(),
      version: currentVersionNum,
    });
    if (project.versions.length > 10) {
      project.versions = project.versions.slice(-10);
    }
  }

  Object.assign(project, data);
  if (data.status === 'published' && !project.publishedAt) {
    project.publishedAt = new Date();
  }

  await project.save();
  return project;
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw ApiError.notFound('Project not found');
  return project;
};
export { deleteProject as delete };

export const updateStatus = async (id, status) => {
  const project = await Project.findById(id);
  if (!project) throw ApiError.notFound('Project not found');

  project.status = status;
  if (status === 'published' && !project.publishedAt) {
    project.publishedAt = new Date();
  }
  await project.save();
  return project;
};

export const duplicate = async (id) => {
  const project = await getById(id);
  const projectObj = project.toObject();
  delete projectObj._id;
  delete projectObj.id;
  delete projectObj.createdAt;
  delete projectObj.updatedAt;
  delete projectObj.versions;
  projectObj.title = `${projectObj.title} (Copy)`;
  projectObj.slug = `${projectObj.slug}-copy-${Date.now().toString().slice(-4)}`;
  projectObj.status = 'draft';
  projectObj.publishedAt = null;

  return create(projectObj);
};

export const reorder = async (items) => {
  if (!Array.isArray(items)) return;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: item.order } },
    },
  }));
  if (ops.length > 0) {
    await Project.bulkWrite(ops);
  }
};

export const getRelated = async (projectId) => {
  const project = await getById(projectId);
  if (!project.technologies || project.technologies.length === 0) {
    return Project.find({ _id: { $ne: projectId }, status: 'published' }).limit(3);
  }

  return Project.find({
    _id: { $ne: projectId },
    status: 'published',
    technologies: { $in: project.technologies },
  }).limit(3);
};

// Aliases for controller compatibility
export {
  getAll as getAllProjects,
  getPublished as getPublishedProjects,
  getBySlug as getProjectBySlug,
  getById as getProjectById,
  create as createProject,
  update as updateProject,
  updateStatus as updateProjectStatus,
  duplicate as duplicateProject,
  reorder as reorderProjects,
  getRelated as getRelatedProjects,
};

