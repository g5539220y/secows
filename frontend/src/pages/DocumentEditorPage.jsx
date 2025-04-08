import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import MarkdownPreview from '../components/MarkdownPreview';
import { markdownApi } from '../services/api';

/**
 * 文档编辑页面
 * 用于创建新文档或编辑现有文档
 */
const DocumentEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const isEditMode = Boolean(id);
  
  // 状态管理
  const [document, setDocument] = useState({
    title: '',
    content: '',
    description: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // AI编辑对话框
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  
  // 标签输入
  const [tagInput, setTagInput] = useState('');

  // 在编辑模式下加载文档数据
  useEffect(() => {
    if (isEditMode) {
      const fetchDocument = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await markdownApi.getDocument(id);
          const data = response.data || {};
          
          setDocument({
            title: data.title || '',
            content: data.content || '',
            description: data.description || '',
            tags: (data.tags || '').split(',').filter(tag => tag.trim() !== '')
          });
        } catch (err) {
          setError(err.message);
          showSnackbar(`加载文档失败: ${err.message}`, 'error');
          console.error('加载文档失败:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDocument();
    }
  }, [id, isEditMode]);

  // 处理文档字段变化
  const handleChange = (field) => (e) => {
    setDocument(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // 处理保存文档
  const handleSave = async () => {
    // 验证必填字段
    if (!document.title.trim()) {
      showSnackbar('请输入文档标题', 'error');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 准备标签字符串
      const tagsString = document.tags.join(',');
      
      // 准备提交的数据
      const documentData = {
        ...document,
        tags: tagsString
      };
      
      // 根据模式选择创建或更新API
      if (isEditMode) {
        await markdownApi.updateDocument(id, documentData);
        showSnackbar('文档已更新', 'success');
      } else {
        const response = await markdownApi.createDocument(documentData);
        showSnackbar('文档已创建', 'success');
        
        // 创建成功后跳转到查看页面
        setTimeout(() => navigate(`/documents/${response.data.id}`), 1000);
      }
    } catch (err) {
      showSnackbar(`保存失败: ${err.message}`, 'error');
      console.error('保存文档失败:', err);
    } finally {
      setIsSaving(false);
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
  
  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !document.tags.includes(tagInput.trim())) {
      setDocument(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // 删除标签
  const handleDeleteTag = (tagToDelete) => {
    setDocument(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };
  
  // 添加标签时按回车
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // 打开AI编辑对话框
  const handleOpenAiDialog = () => {
    setAiDialogOpen(true);
  };
  
  // 关闭AI编辑对话框
  const handleCloseAiDialog = () => {
    setAiDialogOpen(false);
    setAiInstruction('');
  };
  
  // 使用AI编辑文档
  const handleAiEdit = async () => {
    if (!aiInstruction.trim()) {
      showSnackbar('请输入编辑指令', 'error');
      return;
    }
    
    setAiProcessing(true);
    
    try {
      const response = await markdownApi.editMarkdown(
        document.content, 
        aiInstruction, 
        { temperature: 0.7, max_tokens: 3000 }
      );
      
      if (response.status === 'error') {
        throw new Error(response.message);
      }
      
      setDocument(prev => ({
        ...prev,
        content: response.data.content
      }));
      
      showSnackbar('AI编辑完成', 'success');
      handleCloseAiDialog();
    } catch (err) {
      showSnackbar(`AI编辑失败: ${err.message}`, 'error');
      console.error('AI编辑失败:', err);
    } finally {
      setAiProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ mb: 0 }}>
          {isEditMode ? '编辑文档' : '创建文档'}
        </Typography>
        
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isEditMode ? `/documents/${id}` : '/documents')}
        >
          {isEditMode ? '返回查看' : '返回列表'}
        </Button>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              基本信息
            </Typography>
            
            <TextField
              label="文档标题"
              fullWidth
              value={document.title}
              onChange={handleChange('title')}
              margin="normal"
              variant="outlined"
              required
              error={document.title.trim() === ''}
              helperText={document.title.trim() === '' ? '标题不能为空' : ''}
            />
            
            <TextField
              label="文档描述"
              fullWidth
              value={document.description}
              onChange={handleChange('description')}
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                标签
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {document.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
                
                <TextField
                  label="添加标签"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 150 }}
                  InputProps={{
                    endAdornment: (
                      <Button 
                        size="small" 
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        添加
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Paper>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h2">
                    编辑
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleOpenAiDialog}
                  >
                    AI辅助编辑
                  </Button>
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  variant="outlined"
                  placeholder="在这里输入Markdown内容..."
                  value={document.content}
                  onChange={handleChange('content')}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isSaving}
                  fullWidth
                >
                  {isSaving ? <CircularProgress size={24} /> : '保存文档'}
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h2" gutterBottom>
                  预览
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ height: 'calc(100% - 70px)', overflow: 'auto', mb: 2 }}>
                  <MarkdownPreview 
                    markdown={document.content} 
                    sx={{ minHeight: '300px' }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          {/* AI编辑对话框 */}
          <Dialog
            open={aiDialogOpen}
            onClose={!aiProcessing ? handleCloseAiDialog : undefined}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>AI辅助编辑</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                输入您的编辑指令，AI将根据指令帮助您编辑文档内容。
              </Typography>
              <TextField
                autoFocus
                label="编辑指令"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                placeholder="例如：添加一个关于项目背景的部分，或者修改文档结构使其更清晰..."
                disabled={aiProcessing}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                提示：描述越具体，效果越好。您可以要求添加、删除、修改特定内容或调整文档结构。
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAiDialog} disabled={aiProcessing}>
                取消
              </Button>
              <Button 
                onClick={handleAiEdit} 
                color="primary" 
                variant="contained"
                disabled={aiProcessing || !aiInstruction.trim()}
                startIcon={aiProcessing ? <CircularProgress size={24} /> : <AutoAwesomeIcon />}
              >
                {aiProcessing ? '处理中...' : '应用AI编辑'}
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
        </>
      )}
    </Container>
  );
};

export default DocumentEditorPage;