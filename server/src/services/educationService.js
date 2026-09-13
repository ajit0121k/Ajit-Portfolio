import Education from '../models/Education.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async () => {
  return Education.find().sort({ order: 1, startYear: -1 });
};

export const getVisible = async () => {
  return Education.find({ visible: true }).sort({ order: 1, startYear: -1 });
};

export const create = async (data) => {
  const edu = new Education(data);
  await edu.save();
  return edu;
};

export const update = async (id, data) => {
  const edu = await Education.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!edu) throw ApiError.notFound('Education not found');
  return edu;
};

export const deleteEducation = async (id) => {
  const edu = await Education.findByIdAndDelete(id);
  if (!edu) throw ApiError.notFound('Education not found');
  return edu;
};
export { deleteEducation as delete };

export const reorder = async (items) => {
  if (!Array.isArray(items)) return;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: item.order } },
    },
  }));
  if (ops.length > 0) {
    await Education.bulkWrite(ops);
  }
};

export {
  getAll as getAllEducation,
  getVisible as getVisibleEducation,
  create as createEducation,
  update as updateEducation,
  reorder as reorderEducation,
};
