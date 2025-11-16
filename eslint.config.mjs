import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  rules: {
    'node/prefer-global/process': 'off',
  },
})
