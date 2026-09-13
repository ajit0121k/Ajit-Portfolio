import Message from '../models/Message.js';
import ApiError from '../utils/ApiError.js';

export const getAll = async (filters = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const messages = await Message.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Message.countDocuments(query);

  return { messages, total, page, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id) => {
  const message = await Message.findById(id);
  if (!message) throw new ApiError(404, 'Message not found');
  return message;
};

export const create = async (data) => {
  const message = new Message(data);
  await message.save();
  return message;
};

export const markAsRead = async (id) => {
  return Message.findByIdAndUpdate(id, { status: 'read' }, { new: true });
};

export const markAsUnread = async (id) => {
  return Message.findByIdAndUpdate(id, { status: 'unread' }, { new: true });
};

export const archive = async (id) => {
  return Message.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
};

export const reply = async (id, payload) => {
  const message = await Message.findById(id);
  if (!message) throw new ApiError(404, 'Message not found');

  const text = typeof payload === 'object' ? (payload.replyMessage || payload.message || '') : payload;

  message.replyMessage = text;
  message.replied = true;
  message.repliedAt = new Date();
  message.status = 'read';
  await message.save();
  
  return message;
};

export const deleteMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  if (!message) throw new ApiError(404, 'Message not found');
  return message;
};
export { deleteMessage as delete };

export const getUnreadCount = async () => {
  return Message.countDocuments({ status: 'unread' });
};

// Aliases matching messageController method names
export const createMessage = create;
export const getAllMessages = getAll;
export const getMessageById = getById;
export const archiveMessage = archive;
export const replyToMessage = reply;
