const path = require('path');

module.exports = {
    entry: './dev/containers/AppContainer',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src')
    },

    // build && rebuild(original source (lines only)), not for production
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        inline: true,
        contentBase: './src',
        port: 3000
    },

//    module: {
//        loaders: [
//            {
//                loader: 'babel-loader',
//                test: /\.jsx?$/,
//                //node_modules would take a long time
//                exclude: /node_modules/,
//                options: {
//                    //specify that we will be dealing with React code
//                    presets: ['react']
//                }
//            }
//        ]
//    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react', 'stage-1'],
                        plugins: ['transform-decorators-legacy']
                    }
                }
            }
        ]
    },

    resolve: {
        //tells webpack where to look for modules
//        modules: ['node_modules'],
        //extensions that should be used to resolve modules
        extensions: ['.js', '.jsx']
    }
};