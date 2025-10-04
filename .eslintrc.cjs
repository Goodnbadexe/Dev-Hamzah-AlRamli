// === METADATA ===
// Purpose: Configure ESLint for Next.js project
// Author: @Goodnbad.exe
// Inputs: None
// Outputs: ESLint rules configuration
// Tests: npm run lint
// === END METADATA ===
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
  },
};