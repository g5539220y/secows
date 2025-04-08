import os
from dotenv import load_dotenv

load_dotenv()  # 加载.env文件中的环境变量

class Config:
    """应用配置类"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-flask'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///markdown_app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI API配置
    AI_API_KEY = os.environ.get('AI_API_KEY')
    AI_API_BASE_URL = os.environ.get('AI_API_BASE_URL') or 'https://api.openai.com/v1'
    AI_MODEL = os.environ.get('AI_MODEL') or 'gpt-3.5-turbo'
    
    # Markdown文件存储路径
    MARKDOWN_STORE_PATH = os.environ.get('MARKDOWN_STORE_PATH') or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'storage')
    
    @staticmethod
    def init_app(app):
        """初始化应用配置"""
        # 确保存储目录存在
        os.makedirs(Config.MARKDOWN_STORE_PATH, exist_ok=True)