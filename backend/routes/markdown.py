from flask import Blueprint, request, jsonify, current_app
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename

from ..models.markdown import db, MarkdownDocument
from ..ai.mcp import MCPClient

bp = Blueprint('markdown', __name__, url_prefix='/api/markdown')

# 创建MCP客户端
def get_mcp_client():
    """获取MCP客户端实例"""
    return MCPClient(
        api_key=current_app.config['AI_API_KEY'],
        base_url=current_app.config['AI_API_BASE_URL'],
        model=current_app.config['AI_MODEL']
    )

@bp.route('/documents', methods=['GET'])
def get_documents():
    """获取所有Markdown文档"""
    query = request.args.get('q', '')
    
    if query:
        documents = MarkdownDocument.search(query)
    else:
        documents = MarkdownDocument.get_all()
        
    return jsonify({
        'status': 'success',
        'data': [doc.to_dict() for doc in documents]
    })

@bp.route('/documents/<int:doc_id>', methods=['GET'])
def get_document(doc_id):
    """获取指定ID的Markdown文档"""
    doc = MarkdownDocument.get_by_id(doc_id)
    
    if not doc:
        return jsonify({
            'status': 'error',
            'message': '文档不存在'
        }), 404
    
    # 获取文档内容
    content = doc.content
    
    # 合并文档元数据和内容
    doc_data = doc.to_dict()
    doc_data['content'] = content
    
    return jsonify({
        'status': 'success',
        'data': doc_data
    })

@bp.route('/documents', methods=['POST'])
def create_document():
    """创建新的Markdown文档"""
    data = request.json
    
    # 验证必要字段
    if not data or 'title' not in data:
        return jsonify({
            'status': 'error',
            'message': '标题是必需的'
        }), 400
    
    # 创建文件名
    filename = f"{secure_filename(data['title'])}-{datetime.now().strftime('%Y%m%d%H%M%S')}.md"
    
    # 创建新文档记录
    new_doc = MarkdownDocument(
        title=data['title'],
        filename=filename,
        description=data.get('description', ''),
        tags=','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags', '')
    )
    
    # 保存文档内容
    content = data.get('content', '')
    new_doc.save_content(content)
    
    # 保存到数据库
    db.session.add(new_doc)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': '文档创建成功',
        'data': new_doc.to_dict()
    }), 201

@bp.route('/documents/<int:doc_id>', methods=['PUT'])
def update_document(doc_id):
    """更新Markdown文档"""
    doc = MarkdownDocument.get_by_id(doc_id)
    
    if not doc:
        return jsonify({
            'status': 'error',
            'message': '文档不存在'
        }), 404
    
    data = request.json
    
    # 更新文档元数据
    if 'title' in data:
        doc.title = data['title']
    if 'description' in data:
        doc.description = data['description']
    if 'tags' in data:
        doc.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']
    
    # 更新文档内容（如果提供）
    if 'content' in data:
        doc.save_content(data['content'])
    
    # 保存到数据库
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': '文档更新成功',
        'data': doc.to_dict()
    })

@bp.route('/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    """删除Markdown文档"""
    doc = MarkdownDocument.get_by_id(doc_id)
    
    if not doc:
        return jsonify({
            'status': 'error',
            'message': '文档不存在'
        }), 404
    
    # 删除文件
    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'删除文件时出错: {str(e)}'
        }), 500
    
    # 从数据库中删除
    db.session.delete(doc)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': '文档已删除'
    })

@bp.route('/generate', methods=['POST'])
def generate_markdown():
    """使用AI生成Markdown内容"""
    data = request.json
    
    if not data or 'prompt' not in data:
        return jsonify({
            'status': 'error',
            'message': '提示词(prompt)是必需的'
        }), 400
    
    # 获取MCP客户端
    try:
        mcp_client = get_mcp_client()
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
    # 生成Markdown
    options = data.get('options', {})
    result = mcp_client.generate_markdown(data['prompt'], options)
    
    # 检查生成结果
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@bp.route('/edit', methods=['POST'])
def edit_markdown():
    """使用AI编辑Markdown内容"""
    data = request.json
    
    if not data or 'original_text' not in data or 'instructions' not in data:
        return jsonify({
            'status': 'error',
            'message': '原始文本和编辑指示是必需的'
        }), 400
    
    # 获取MCP客户端
    try:
        mcp_client = get_mcp_client()
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
    # 编辑Markdown
    options = data.get('options', {})
    result = mcp_client.edit_markdown(data['original_text'], data['instructions'], options)
    
    # 检查编辑结果
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)