const {
    createProxyMiddleware
} = require('http-proxy-middleware')
module.exports = (req, res) => {
    let target = ''
    if (req.url.startsWith('/adpro/gitmirror')) {
        target = 'https://cdn.gitmirror.com'
    }
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/adpro/([^/]*)/': '/'
        },
        headers: {
            Cookie: 'cf_clearance=3NgsD2I_jm6qYmB1CDDop63txvvRERy9ah1C.JBAv7I-1706882981-1-AV40WoWYPPfZtp1V/NTOUiFCGg2NftndJY2RdArVKzQ+5wuJ9Oj3qjSrclxNbrapoVCnkQ3Kz2jEm7gHp8iY9VY='
        }
    })(req, res)
}