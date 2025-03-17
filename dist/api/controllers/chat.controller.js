"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCompletion = void 0;
const chatgpt_service_1 = require("../../services/chatgpt.service");
const chatCompletion = async (req, res, next) => {
    try {
        const { message, config } = req.body;
        if (!message) {
            throw new Error('Message is required');
        }
        const chatGPTService = new chatgpt_service_1.ChatGPTService();
        const response = await chatGPTService.generateResponse(message, config);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.chatCompletion = chatCompletion;
//# sourceMappingURL=chat.controller.js.map