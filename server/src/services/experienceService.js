import Experience from '../models/Experience.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async () => {
  return Experience.find().sort({ order: 1, startDate: -1 });
};

export const getVisible = async () => {
  return Experience.find({ visible: true }).sort({ order: 1, startDate: -1 });
};

export const create = async (data) => {
  const exp = new Experience(data);
  await exp.save();
  return exp;
};

export const update = async (id, data) => {
  const exp = await Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!exp) throw ApiError.notFound('Experience not found');
  return exp;
};

export const deleteExperience = async (id) => {
  const exp = await Experience.findByIdAndDelete(id);
  if (!exp) throw ApiError.notFound('Experience not found');
  return exp;
};
export { deleteExperience as delete };

export const reorder = async (items) => {
  if (!Array.isArray(items)) return;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: item.order } },
    },
  }));
  if (ops.length > 0) {
    await Experience.bulkWrite(ops);
  }
};

export {
  getAll as getAllExperience,
  getVisible as getVisibleExperience,
  create as createExperience,
  update as updateExperience,
  reorder as reorderExperience,
};
