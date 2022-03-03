module.exports = {
    publicPath: '/voice',
    devServer: {
        port: 8080, // 端口号
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'https://rcrtc-api.rongcloud.net',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
}
