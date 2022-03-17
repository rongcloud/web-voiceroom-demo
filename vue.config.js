module.exports = {
    publicPath: '/voice_v2',
    devServer: {
        port: 8080, // 端口号
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'https://rcrtc-api.rongcloud.net/',//测试
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}
