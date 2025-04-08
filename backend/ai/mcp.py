import requests
import json
import os
from flask import current_app

class MCPClient:
    """MCP协议客户端，用于与AI API通信"""
    
    def __init__(self, api_key=None, base_url=None, model=None):
        """初始化MCP客户端
        
        Args:
            api_key: API密钥
            base_url: API基础URL
            model: 使用的AI模型名称
        """
        self.api_key = api_key or os.environ.get('AI_API_KEY') or current_app.config['AI_API_KEY']
        self.base_url = base_url or os.environ.get('AI_API_BASE_URL') or current_app.config['AI_API_BASE_URL']
        self.model = model or os.environ.get('AI_MODEL') or current_app.config['AI_MODEL']
        
        if not self.api_key:
            raise ValueError("API密钥未提供，请在环境变量或配置文件中设置AI_API_KEY")
    
    def generate_markdown(self, prompt, options=None):
        """生成Markdown内容
        
        Args:
            prompt: 生成内容的提示
            options: 生成选项，如最大长度、温度等
            
        Returns:
            生成的Markdown文本
        """
        options = options or {}
        
        # 构建MCP协议请求格式
        messages = [
            {"role": "system", "content": "你是一个专业的Markdown文档生成助手，请根据用户的要求生成格式规范的Markdown文档。"},
            {"role": "user", "content": prompt}
        ]
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": options.get("temperature", 0.7),
            "max_tokens": options.get("max_tokens", 2000),
            "top_p": options.get("top_p", 1.0),
            "frequency_penalty": options.get("frequency_penalty", 0),
            "presence_penalty": options.get("presence_penalty", 0)
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            # 发送请求到API
            response = requests.post(
                f"{self.base_url}/chat/completions", 
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            # 解析响应
            response_data = response.json()
            markdown_text = response_data['choices'][0]['message']['content']
            
            return {
                "status": "success",
                "content": markdown_text,
                "usage": response_data.get("usage", {})
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API请求错误: {str(e)}"
            }
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            return {
                "status": "error",
                "message": f"响应解析错误: {str(e)}"
            }
    
    def edit_markdown(self, original_text, instructions, options=None):
        """编辑现有的Markdown内容
        
        Args:
            original_text: 原始Markdown文本
            instructions: 编辑指示
            options: 生成选项
            
        Returns:
            编辑后的Markdown文本
        """
        options = options or {}
        
        # 构建编辑请求消息
        messages = [
            {"role": "system", "content": "你是一个专业的Markdown编辑助手，请根据用户的要求编辑Markdown文档。"},
            {"role": "user", "content": f"原始文档内容:\n\n{original_text}\n\n编辑指示:\n{instructions}"}
        ]
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": options.get("temperature", 0.7),
            "max_tokens": options.get("max_tokens", 2000),
            "top_p": options.get("top_p", 1.0),
            "frequency_penalty": options.get("frequency_penalty", 0),
            "presence_penalty": options.get("presence_penalty", 0)
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            # 发送请求到API
            response = requests.post(
                f"{self.base_url}/chat/completions", 
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            # 解析响应
            response_data = response.json()
            edited_text = response_data['choices'][0]['message']['content']
            
            return {
                "status": "success",
                "content": edited_text,
                "usage": response_data.get("usage", {})
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API请求错误: {str(e)}"
            }
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            return {
                "status": "error",
                "message": f"响应解析错误: {str(e)}"
            }