import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Paper, Box } from '@mui/material';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Markdown预览组件
 * 
 * @param {Object} props 组件属性
 * @param {string} props.markdown Markdown文本
 * @param {Object} props.sx 额外的样式属性
 */
const MarkdownPreview = ({ markdown = '', sx = {} }) => {
  // 如果没有内容，显示占位符
  if (!markdown || markdown.trim() === '') {
    return (
      <Paper elevation={0} className="markdown-preview" sx={{ ...sx, p: 2 }}>
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Markdown内容将在这里显示...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      className="markdown-preview" 
      sx={{ 
        ...sx, 
        p: 2,
        overflow: 'auto'
      }}
    >
      <Box className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={materialLight}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ node, ...props }) => <Typography variant="h1" {...props} />,
            h2: ({ node, ...props }) => <Typography variant="h2" {...props} />,
            h3: ({ node, ...props }) => <Typography variant="h3" {...props} />,
            h4: ({ node, ...props }) => <Typography variant="h4" {...props} />,
            h5: ({ node, ...props }) => <Typography variant="h5" {...props} />,
            h6: ({ node, ...props }) => <Typography variant="h6" {...props} />,
            p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />
          }}
        >
          {markdown}
        </ReactMarkdown>
      </Box>
    </Paper>
  );
};

export default MarkdownPreview;