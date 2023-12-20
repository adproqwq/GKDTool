const {
    createProxyMiddleware
} = require('http-proxy-middleware')
module.exports = (req, res) => {
    let target = ''
    if (req.url.startsWith('/adpro/gkd')) {
        target = 'https://registry.npmmirror.com/@gkd-kit/subscription/latest/files/dist'
    }
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/adpro/([^/]*)/': '/'
        }
    })(req, res)
}