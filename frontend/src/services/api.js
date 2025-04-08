/**
 * API服务模块
 * 用于处理与后端API的所有交互
 */

// API基础URL，如果需要可以从环境变量加载
const API_BASE_URL = '';

/**
 * 通用请求处理函数
 */
async function handleRequest(url, options) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `请求失败 (${response.status})`);
    }
    
    return data;
  } catch (error) {
    console.error(`API请求错误: ${url}`, error);
    throw error;
  }
}

/**
 * Markdown文档相关API
 */
const markdownApi = {
  // 获取所有文档
  getAllDocuments: async (query = '') => {
    const queryParam = query ? `?q=${encodeURIComponent(query)}` : '';
    return handleRequest(`/api/markdown/documents${queryParam}`, {
      method: 'GET',
    });
  },
  
  // 获取单个文档
  getDocument: async (docId) => {
    return handleRequest(`/api/markdown/documents/${docId}`, {
      method: 'GET',
    });
  },
  
  // 创建文档
  createDocument: async (documentData) => {
    return handleRequest('/api/markdown/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });
  },
  
  // 更新文档
  updateDocument: async (docId, documentData) => {
    return handleRequest(`/api/markdown/documents/${docId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });
  },
  
  // 删除文档
  deleteDocument: async (docId) => {
    return handleRequest(`/api/markdown/documents/${docId}`, {
      method: 'DELETE',
    });
  },
  
  // 生成Markdown
  generateMarkdown: async (prompt, options) => {
    return handleRequest('/api/markdown/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, options }),
    });
  },
  
  // 编辑Markdown
  editMarkdown: async (original_text, instructions, options) => {
    return handleRequest('/api/markdown/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_text, instructions, options }),
    });
  },
};

export { markdownApi };