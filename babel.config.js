const {isHot} = require('./env.config')

const babel = module.exports = env => ({
  loader: 'babel-loader',
  options: {
    presets: [
      ['env', {
        modules: false,
        targets: 'last 2 versions',
      }],
      'stage-2',
      'react',
    ],
    plugins: isHot(env) && ['react-hot-loader/babel']
  }
})
