const {
    createProxyMiddleware
} = require('http-proxy-middleware')
module.exports = (req, res) => {
    let target = ''
    if (req.url.startsWith('/adpro/gitmirror')) {
        target = 'https://raw.gitmirror.com'
    }
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/adpro/([^/]*)/': '/'
        },
        cookieDomainRewrite: {
            'rules.adproqwq.xyz': 'raw.gitmirror.com',
        },
    })(req, res)
}