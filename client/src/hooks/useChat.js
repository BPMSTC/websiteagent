import { useState } from 'react';
import { api } from '../utils/api';

export function useChat() {
  const [conversation, setConversation] = useState([]);
  const [currentHtml, setCurrentHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (config, userMessage) => {
    setLoading(true);
    setError(null);

    try {
      // Add user message to conversation if provided
      const newConversation = userMessage
        ? [...conversation, { role: 'user', content: userMessage }]
        : conversation;

      // Call API
      const response = await api.generate(newConversation, config, userMessage);

      // Update conversation with assistant response
      const updatedConversation = [
        ...newConversation,
        { role: 'assistant', content: response.message }
      ];

      setConversation(updatedConversation);
      setCurrentHtml(response.html);

      return response;

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to generate content';
      setError(errorMessage);
      
      // Log error to debug dashboard
      api.logError('Generation failed', err, {
        topic: config?.topic,
        depthLevel: config?.depthLevel,
        isFollowUp: !!userMessage,
        conversationLength: conversation.length
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setConversation([]);
    setCurrentHtml('');
    setError(null);
  };

  return {
    conversation,
    currentHtml,
    loading,
    error,
    sendMessage,
    reset
  };
}
