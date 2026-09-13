import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as messageService from '../services/messageService.js';

export const createMessage = asyncHandler(async (req, res) => {
  const ipHash = crypto.createHash('sha256').update(req.ip).digest('hex');
  const userAgent = req.headers['user-agent'];
  const messageData = { ...req.body, ipHash, userAgent };
  const message = await messageService.createMessage(messageData);
  return ApiResponse.created(res, 'Message created successfully', message);
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.getAllMessages(req.query);
  return ApiResponse.success(res, 200, 'Messages retrieved', messages);
});

export const getMessageById = asyncHandler(async (req, res) => {
  const message = await messageService.getMessageById(req.params.id);
  return ApiResponse.success(res, 200, 'Message retrieved', message);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await messageService.markAsRead(req.params.id);
  return ApiResponse.success(res, 200, 'Message marked as read', message);
});

export const markAsUnread = asyncHandler(async (req, res) => {
  const message = await messageService.markAsUnread(req.params.id);
  return ApiResponse.success(res, 200, 'Message marked as unread', message);
});

export const archiveMessage = asyncHandler(async (req, res) => {
  const message = await messageService.archiveMessage(req.params.id);
  return ApiResponse.success(res, 200, 'Message archived', message);
});

export const replyToMessage = asyncHandler(async (req, res) => {
  const message = await messageService.replyToMessage(req.params.id, req.body);
  return ApiResponse.success(res, 200, 'Replied to message', message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await messageService.deleteMessage(req.params.id);
  return ApiResponse.success(res, 200, 'Message deleted');
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await messageService.getUnreadCount();
  return ApiResponse.success(res, 200, 'Unread count retrieved', { count });
});
