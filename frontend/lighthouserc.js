module.exports = {
  ci: {
    collect: { /* pages to audit */ },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
      },
    },
  },
};
