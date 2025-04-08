import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * 创建文档页面
 * 提供两种创建文档的方式：手动创建或AI生成
 */
const CreateDocumentPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ mb: 0 }}>
          创建新文档
        </Typography>
        
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
        >
          返回文档列表
        </Button>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h2" gutterBottom>
          选择创建方式
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          您可以选择手动创建一个空白文档，或使用AI助手生成Markdown内容
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CreateIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h2" component="h2" gutterBottom align="center">
                  手动创建
                </Typography>
                <Typography variant="body1">
                  从空白文档开始，使用Markdown编辑器手动编写内容。适合对Markdown有一定了解，
                  或有明确写作思路的用户。
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/documents/edit')}
                >
                  开始编写
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <AutoAwesomeIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h2" component="h2" gutterBottom align="center">
                  AI生成
                </Typography>
                <Typography variant="body1">
                  通过AI助手生成Markdown内容，只需输入简单的提示词，即可获得结构良好的文档。
                  生成后可进一步编辑和完善。
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/generate')}
                >
                  AI生成
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h2" gutterBottom>
          创建文档小提示
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" gutterBottom>
            手动创建文档
          </Typography>
          <Typography variant="body1" paragraph>
            • 使用Markdown语法可以轻松创建格式丰富的文档
          </Typography>
          <Typography variant="body1" paragraph>
            • 添加适当的标签可以更好地分类和查找文档
          </Typography>
          <Typography variant="body1" paragraph>
            • 文档编辑器支持实时预览，方便查看效果
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h3" gutterBottom>
            使用AI生成
          </Typography>
          <Typography variant="body1" paragraph>
            • 提示词越具体，生成的内容质量越高
          </Typography>
          <Typography variant="body1" paragraph>
            • 可以指定文档的结构、风格、长度等要素
          </Typography>
          <Typography variant="body1" paragraph>
            • 生成后的内容可以随时编辑和调整
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateDocumentPage;