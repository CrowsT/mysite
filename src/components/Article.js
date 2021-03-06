import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

import { metas } from 'articles/metas';
import { ArticleItem } from 'components/ArticleItem';
import { serif } from 'styles/type';
import { useColor, Token } from 'styles/colors';

const filterFrontMatter = (text) => {
  const lines = text.split('\n');
  if ((lines.length < 2 || lines[0] !== '---')) {
    return text;
  }
  const endIndex = lines.slice(1).findIndex((line) => line === '---') + 1;
  return lines.slice((endIndex + 1)).join('\n');
};

const useArticleFilename = (filename) => {
  const [article, setArticle] = useState('');
  useEffect(() => {
    (async function fetchArticle() {
      if (article === '') {
        /* eslint-disable prefer-template */
        const { default: path } = await import('articles/' + filename + '.md');
        /* eslint-enable prefer-template */
        const response = await fetch(path);
        const text = await response.text();
        setArticle(filterFrontMatter(text));
      }
    }());
  }, [article, filename]);
  return article;
};

const Wrapper = styled.div`
  padding: 1rem 0;
`;

const ArticleStyle = styled.article`
  margin: 3rem 0 2rem 0;
  img {
    display: block;
    width: 100%;
    margin: 1rem 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    ${serif};
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 1rem 0;
    line-height: 1.5;
    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 0;
    }
    hyphens: auto;
  }

  h1 {
    font-size: 1.75rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.25rem;
  }
  h4, h5 {
    font-size: 1rem;
  }

  li {
    line-height: 1.5;
  }

  pre {
    max-width: 100%;
    overflow-x: auto;
  }
`;

const LoadingHint = styled.h3`
  color: ${useColor(Token.orangeHard)};
`;


const Article = () => {
  const { file } = useParams('file');
  const meta = metas.find((m) => m.file === `${file}.md`);
  if (!meta) {
    return null;
  }
  const article = useArticleFilename(file);
  const content = (article === '') ? (
    <LoadingHint>加载中...</LoadingHint>
  ) : (
    <ReactMarkdown source={article} />
  );
  const tags = meta.tags.map((tag) => <meta key={tag} property="og:article:tag" content={tag} />);
  return (
    <Wrapper>
      <Helmet>
        <title>{`crows.moe - ${meta.title}`}</title>
        <meta property="og:title" content={`crows.moe - ${meta.title}`} />
        <meta property="og:type" content="article" />
        {meta.intro && <meta property="og:description" content={meta.intro} />}
        <meta property="og:article:published_time" content={meta.publish} />
        <meta property="og:article:author" content="Nanozuki" />
        {tags}
      </Helmet>
      <ArticleItem meta={meta} />
      <ArticleStyle>
        { content }
      </ArticleStyle>
    </Wrapper>
  );
};

export { Article };
