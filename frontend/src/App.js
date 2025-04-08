import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 导入布局和页面组件
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DocumentListPage from './pages/DocumentListPage';
import DocumentEditorPage from './pages/DocumentEditorPage';
import DocumentViewPage from './pages/DocumentViewPage';
import CreateDocumentPage from './pages/CreateDocumentPage';
import GenerateMarkdownPage from './pages/GenerateMarkdownPage';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/:id" element={<DocumentViewPage />} />
            <Route path="/documents/:id/edit" element={<DocumentEditorPage />} />
            <Route path="/create" element={<CreateDocumentPage />} />
            <Route path="/generate" element={<GenerateMarkdownPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;