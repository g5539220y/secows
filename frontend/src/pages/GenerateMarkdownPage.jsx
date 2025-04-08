import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Slider,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import MarkdownPreview from '../components/MarkdownPreview';

/**
 * AI Markdown生成页面
 */
const GenerateMarkdownPage = () => {
  // 状态管理
  const [prompt, setPrompt] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 生成参数
  const [options, setOptions] = useState({
    temperature: 0.7,
    max_tokens: 2000,
    model: 'gpt-3.5-turbo'
  });

  // 处理提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      showSnackbar('请输入生成提示词', 'error');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用后端API生成Markdown
      const response = await fetch('/api/markdown/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          options
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '生成失败');
      }
      
      setGeneratedMarkdown(data.data.content);
      showSnackbar('Markdown文档生成成功', 'success');
    } catch (err) {
      setError(err.message);
      showSnackbar(`生成失败: ${err.message}`, 'error');
      console.error('生成Markdown失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 保存生成的文档
  const handleSaveDocument = async () => {
    if (!generatedMarkdown.trim()) {
      showSnackbar('没有可保存的内容', 'warning');
      return;
    }
    
    try {
      // 打开保存对话框
      const title = prompt.substring(0, 50);
      const response = await fetch('/api/markdown/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: generatedMarkdown,
          description: prompt.substring(0, 200),
          tags: 'AI生成'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '保存失败');
      }
      
      showSnackbar('文档保存成功', 'success');
    } catch (err) {
      showSnackbar(`保存失败: ${err.message}`, 'error');
      console.error('保存文档失败:', err);
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

  // 处理参数变化
  const handleOptionChange = (option, value) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom>
        AI生成Markdown
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h2" gutterBottom>
              输入提示词
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="提示词"
                multiline
                rows={6}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入详细的提示词，描述您想要生成的Markdown内容..."
                disabled={isLoading}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="h3" gutterBottom>
                生成参数
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="temperature-slider" gutterBottom>
                  创造性 (Temperature): {options.temperature}
                </Typography>
                <Slider
                  value={options.temperature}
                  onChange={(_, value) => handleOptionChange('temperature', value)}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  valueLabelDisplay="auto"
                  aria-labelledby="temperature-slider"
                  disabled={isLoading}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="tokens-slider" gutterBottom>
                  最大长度 (Tokens): {options.max_tokens}
                </Typography>
                <Slider
                  value={options.max_tokens}
                  onChange={(_, value) => handleOptionChange('max_tokens', value)}
                  min={500}
                  max={4000}
                  step={100}
                  valueLabelDisplay="auto"
                  aria-labelledby="tokens-slider"
                  disabled={isLoading}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel id="model-select-label">AI模型</InputLabel>
                  <Select
                    labelId="model-select-label"
                    value={options.model}
                    label="AI模型"
                    onChange={(e) => handleOptionChange('model', e.target.value)}
                  >
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : '生成Markdown'}
              </Button>
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h2" gutterBottom>
              生成结果
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ height: '500px', overflow: 'auto' }}>
              <MarkdownPreview 
                markdown={generatedMarkdown} 
                sx={{ minHeight: '100%' }}
              />
            </Box>
            
            {generatedMarkdown && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveDocument}
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                保存文档
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
      
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

export default GenerateMarkdownPage;