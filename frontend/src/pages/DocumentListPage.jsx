import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import { markdownApi } from '../services/api';

/**
 * Markdown文档列表页面
 * 显示所有文档并提供搜索、查看、编辑和删除功能
 */
const DocumentListPage = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 加载文档列表
  const loadDocuments = async (query = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await markdownApi.getAllDocuments(query);
      setDocuments(response.data || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`加载文档失败: ${err.message}`, 'error');
      console.error('加载文档失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadDocuments();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    loadDocuments(searchQuery);
  };

  // 处理搜索输入框回车事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 打开删除确认对话框
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // 确认删除文档
  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await markdownApi.deleteDocument(documentToDelete.id);
      loadDocuments(searchQuery); // 重新加载文档列表
      showSnackbar('文档已删除', 'success');
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
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  // 从标签字符串解析标签数组
  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').filter(tag => tag.trim() !== '');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          文档列表
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          新建文档
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="搜索文档..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ ml: 2, height: 56 }}
            disabled={isLoading}
          >
            搜索
          </Button>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="body1">
              {searchQuery ? '没有找到匹配的文档' : '没有可用的文档'}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/generate')}
              sx={{ mt: 2 }}
              startIcon={<AddIcon />}
            >
              生成新文档
            </Button>
          </Box>
        ) : (
          <List>
            {documents.map((doc, index) => (
              <React.Fragment key={doc.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h3">
                        {doc.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {doc.description || '无描述'}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                            创建时间: {formatDate(doc.created_at)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            修改时间: {formatDate(doc.updated_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          {parseTags(doc.tags).map((tag) => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="view" 
                      onClick={() => navigate(`/documents/${doc.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      sx={{ ml: 1 }}
                      onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      sx={{ ml: 1 }}
                      onClick={() => handleDeleteClick(doc)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除文档 "{documentToDelete?.title}" 吗？此操作不可撤销。
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

export default DocumentListPage;