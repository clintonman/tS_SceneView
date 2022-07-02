// assumes dist will be container for page
// module.exports = {
//     publicPath: "/web/dist/"
// }
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/web/sceneview2/'
    : '/'
}