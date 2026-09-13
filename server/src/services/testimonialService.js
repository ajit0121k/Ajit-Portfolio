import Testimonial from '../models/Testimonial.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async () => {
  return Testimonial.find().sort({ order: 1, createdAt: -1 });
};

export const getVisible = async () => {
  return Testimonial.find().sort({ order: 1, createdAt: -1 });
};

export const create = async (data) => {
  const testimonial = new Testimonial(data);
  await testimonial.save();
  return testimonial;
};

export const update = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  return testimonial;
};

export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  return testimonial;
};
export { deleteTestimonial as delete };

export const reorder = async (items) => {
  const ops = items.map(item => ({
    updateOne: {
      filter: { _id: item.id },
      update: { order: item.order }
    }
  }));
  await Testimonial.bulkWrite(ops);
};

// Aliases matching testimonialController method names
export const getVisibleTestimonials = getVisible;
export const getAllTestimonials = getAll;
export const createTestimonial = create;
export const updateTestimonial = update;
export const reorderTestimonials = reorder;
