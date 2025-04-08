from datetime import datetime
import os
from flask_sqlalchemy import SQLAlchemy
from flask import current_app

db = SQLAlchemy()

class MarkdownDocument(db.Model):
    """Markdown文档模型"""
    __tablename__ = 'markdown_documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    filename = db.Column(db.String(200), nullable=False, unique=True)
    description = db.Column(db.String(500))
    tags = db.Column(db.String(200))  # 以逗号分隔的标签列表
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def file_path(self):
        """获取文档的完整文件路径"""
        return os.path.join(current_app.config['MARKDOWN_STORE_PATH'], self.filename)
    
    @property
    def content(self):
        """读取文档内容"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ""
    
    def save_content(self, content):
        """保存文档内容"""
        with open(self.file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        self.updated_at = datetime.utcnow()
    
    @classmethod
    def get_all(cls):
        """获取所有文档"""
        return cls.query.order_by(cls.updated_at.desc()).all()
    
    @classmethod
    def get_by_id(cls, doc_id):
        """通过ID获取文档"""
        return cls.query.get(doc_id)
    
    @classmethod
    def search(cls, query):
        """搜索文档"""
        search_query = f"%{query}%"
        return cls.query.filter(
            db.or_(
                cls.title.ilike(search_query),
                cls.description.ilike(search_query),
                cls.tags.ilike(search_query)
            )
        ).order_by(cls.updated_at.desc()).all()
    
    def to_dict(self):
        """将文档转换为字典"""
        return {
            'id': self.id,
            'title': self.title,
            'filename': self.filename,
            'description': self.description,
            'tags': self.tags.split(',') if self.tags else [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }