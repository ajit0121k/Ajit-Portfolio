import Certification from '../models/Certification.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async () => {
  return Certification.find().sort({ order: 1, issueDate: -1 });
};

export const getVisible = async () => {
  return Certification.find({ visible: true }).sort({ order: 1, issueDate: -1 });
};

export const create = async (data) => {
  const cert = new Certification(data);
  await cert.save();
  return cert;
};

export const update = async (id, data) => {
  const cert = await Certification.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!cert) throw ApiError.notFound('Certification not found');
  return cert;
};

export const deleteCertification = async (id) => {
  const cert = await Certification.findByIdAndDelete(id);
  if (!cert) throw ApiError.notFound('Certification not found');
  return cert;
};
export { deleteCertification as delete };

export const reorder = async (items) => {
  if (!Array.isArray(items)) return;
  const ops = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: item.order } },
    },
  }));
  if (ops.length > 0) {
    await Certification.bulkWrite(ops);
  }
};

export {
  getAll as getAllCertifications,
  getVisible as getVisibleCertifications,
  create as createCertification,
  update as updateCertification,
  reorder as reorderCertifications,
};
