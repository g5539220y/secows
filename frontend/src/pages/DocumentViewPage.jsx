import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  Skeleton,
  Divider,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import MarkdownPreview from '../components/MarkdownPreview';
import { markdownApi } from '../services/api';

/**
 * 文档查看页面
 * 显示单个Markdown文档的详细内容
 */
const DocumentViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 状态管理
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 加载文档数据
  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await markdownApi.getDocument(id);
        setDocument(response.data || null);
      } catch (err) {
        setError(err.message);
        showSnackbar(`加载文档失败: ${err.message}`, 'error');
        console.error('加载文档失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  // 打开删除确认对话框
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // 确认删除文档
  const handleConfirmDelete = async () => {
    try {
      await markdownApi.deleteDocument(id);
      showSnackbar('文档已删除', 'success');
      setTimeout(() => navigate('/documents'), 1500); // 删除成功后跳转到文档列表
    } catch (err) {
      showSnackbar(`删除失败: ${err.message}`, 'error');
      console.error('删除文档失败:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // 显示提示消息
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  // 从标签字符串解析标签数组
  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').filter(tag => tag.trim() !== '');
  };

  // 加载状态时显示骨架屏
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="30%" height={30} sx={{ mb: 4 }} />
          
          <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        </Paper>
      </Container>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          返回文档列表
        </Button>
        
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // 文档不存在
  if (!document) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          返回文档列表
        </Button>
        
        <Alert severity="warning">
          文档不存在或已被删除
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/documents')}
        sx={{ mb: 2 }}
      >
        返回文档列表
      </Button>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h1" gutterBottom sx={{ mb: 0 }}>
            {document.title}
          </Typography>
          
          <Box>
            <IconButton 
              aria-label="edit" 
              onClick={() => navigate(`/documents/${id}/edit`)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              aria-label="delete" 
              onClick={handleDeleteClick}
              color="error"
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            创建时间: {formatDate(document.created_at)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            最后修改: {formatDate(document.updated_at)}
          </Typography>
        </Box>
        
        {document.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" gutterBottom>
              描述
            </Typography>
            <Typography variant="body1">
              {document.description}
            </Typography>
          </Box>
        )}
        
        {parseTags(document.tags).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" gutterBottom>
              标签
            </Typography>
            <Box>
              {parseTags(document.tags).map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ mb: 3 }} />
        
        <Box>
          <Typography variant="h3" gutterBottom>
            内容
          </Typography>
          <Box sx={{ mt: 2 }}>
            <MarkdownPreview markdown={document.content} />
          </Box>
        </Box>
      </Paper>
      
      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除文档 "{document.title}" 吗？此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>取消</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentViewPage;