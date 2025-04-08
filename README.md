# AI Markdown生成与管理系统

这是一个基于Flask和React的Web应用程序，用于AI生成Markdown并进行管理。该应用程序使用MCP协议与AI API进行通信，以生成Markdown内容。

## 项目结构

```
├── backend/              # Flask后端
│   ├── app.py           # 主应用入口
│   ├── config.py        # 配置文件
│   ├── requirements.txt # 后端依赖
│   ├── ai/              # AI交互模块
│   │   └── mcp.py       # MCP协议实现
│   ├── models/          # 数据模型
│   └── routes/          # API路由
└── frontend/            # React前端
    ├── public/          # 静态资源
    ├── src/             # 源代码
    │   ├── components/  # React组件
    │   ├── pages/       # 页面组件
    │   ├── services/    # API服务
    │   └── App.js       # 主应用组件
    ├── package.json     # 前端依赖
    └── README.md        # 前端说明
```

## 功能特点

- AI生成Markdown内容
- Markdown编辑和预览
- 文件管理和组织
- 响应式用户界面

## 安装说明

### 后端设置

1. 进入后端目录并创建虚拟环境：
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # 在Windows上
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 设置环境变量（包括AI API密钥）

4. 启动服务器：
```bash
python app.py
```

### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

## 使用方法

1. 打开浏览器，访问 `http://localhost:3000`
2. 使用AI生成功能创建新的Markdown内容
3. 编辑、预览和组织您的Markdown文件

## 技术栈

- **后端**：Flask, Python, OpenAI API
- **前端**：React, Axios, React Router, React Markdown
- **数据存储**：SQLite/文件系统

## 注意事项

使用此应用程序需要配置AI服务提供商的API密钥。