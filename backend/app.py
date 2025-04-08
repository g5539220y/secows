import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from .config import Config
from .models.markdown import db
from .routes.markdown import bp as markdown_bp

def create_app(config_class=Config):
    """创建Flask应用实例"""
    # 创建Flask应用
    app = Flask(__name__, static_folder=None)
    
    # 加载配置
    app.config.from_object(config_class)
    config_class.init_app(app)
    
    # 初始化扩展
    CORS(app)  # 启用跨域资源共享
    db.init_app(app)  # 初始化数据库
    
    # 注册蓝图
    app.register_blueprint(markdown_bp)
    
    # 创建数据库表（如果不存在）
    with app.app_context():
        db.create_all()
    
    # 前端静态文件服务
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """提供前端静态文件服务"""
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

# 创建应用实例
app = create_app()

# 在开发环境中运行应用
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)