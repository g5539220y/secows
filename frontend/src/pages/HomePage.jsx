import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import CreateIcon from '@mui/icons-material/Create';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

/**
 * 首页组件
 * 显示系统简介和主要功能入口
 */
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h1" gutterBottom>
          AI Markdown生成与管理系统
        </Typography>
        <Typography variant="h3" color="text.secondary" sx={{ mb: 4 }}>
          使用AI技术生成高质量的Markdown文档，并进行便捷管理
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CreateIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h2" component="h2" gutterBottom align="center">
                AI生成Markdown
              </Typography>
              <Typography variant="body1">
                使用先进的AI技术，只需提供简单的提示词，即可生成专业、格式规范的Markdown文档，大幅提高内容创作效率。
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/generate')}
              >
                开始生成
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <FormatListBulletedIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h2" component="h2" gutterBottom align="center">
                文档管理
              </Typography>
              <Typography variant="body1">
                对生成的Markdown文档进行集中管理，包括查看、编辑、分类和搜索，使文档组织更加系统化。
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/documents')}
              >
                查看文档
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <DescriptionIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h2" component="h2" gutterBottom align="center">
                创建文档
              </Typography>
              <Typography variant="body1">
                创建新的Markdown文档，可以从头开始编写或基于模板快速创建，支持多种格式和样式。
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/create')}
              >
                新建文档
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h2" gutterBottom>
          关于本系统
        </Typography>
        <Typography variant="body1" paragraph>
          本系统是一个基于Flask和React的Web应用程序，旨在利用AI技术简化Markdown文档的创建和管理流程。
          系统通过MCP协议与AI API进行通信，使用户可以轻松生成高质量的Markdown内容。
        </Typography>
        <Typography variant="body1">
          主要功能包括：
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              <strong>AI辅助生成：</strong>通过简单提示词自动生成格式规范的Markdown文档
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>编辑与预览：</strong>实时编辑和预览Markdown内容，所见即所得
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>文档管理：</strong>集中管理所有Markdown文档，支持分类和搜索
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>导出分享：</strong>支持将Markdown导出为多种格式，方便分享和使用
            </Typography>
          </li>
        </ul>
      </Paper>
    </Container>
  );
};

export default HomePage;