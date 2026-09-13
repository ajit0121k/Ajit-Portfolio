import Skill from '../models/Skill.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async () => {
  return Skill.find().sort({ category: 1, order: 1 });
};

export const getVisible = async () => {
  return Skill.find({ visible: true }).sort({ category: 1, order: 1 });
};

export const create = async (data) => {
  const skill = new Skill(data);
  await skill.save();
  return skill;
};

export const update = async (id, data) => {
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!skill) throw ApiError.notFound('Skill not found');
  return skill;
};

export const deleteSkill = async (id) => {
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) throw ApiError.notFound('Skill not found');
  return skill;
};
export { deleteSkill as delete };

export const reorder = async (items) => {
  if (!Array.isArray(items)) return;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: item.order } },
    },
  }));
  if (ops.length > 0) {
    await Skill.bulkWrite(ops);
  }
};

export {
  getAll as getAllSkills,
  getVisible as getVisibleSkills,
  create as createSkill,
  update as updateSkill,
  reorder as reorderSkills,
};
