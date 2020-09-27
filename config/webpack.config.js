const path                      = require('path');
const CopyWebpackPlugin         = require("copy-webpack-plugin");
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent    = require('react-dev-utils/getCSSModuleLocalIdent');
const generateNunjucksHtml      = require('nunjucks-template-loader/utils/generateNunjucksHtml');
const nunjucksFilters           = require('nunjucks-template-loader/filters');

const PATHS = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    templates: path.resolve(__dirname, '../templates'),
    templatesGlob: path.resolve(__dirname, '../templates/pages/**/'),
    pages: path.resolve(__dirname, '../templates/pages'),
    assets: 'assets',
    bundles: 'bundles'
}

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        "index": [
            `${PATHS.src}/js/index.js`,
            `${PATHS.src}/scss/index.js`,
        ]
    },
    output: {
        path: PATHS.dist,
        filename: `${PATHS.bundles}/js/[name].[chunkhash].js`,
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, '../src/js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.module\.(sa|sc|c)ss$/,
                exclude: /(node_modules)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: { path: path.resolve(__dirname, './postcss.config.js') }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: [/(node_modules)/, /\.module\.(sa|sc|c)ss$/],
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,

                            config: { path: path.resolve(__dirname, './postcss.config.js') }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.m?jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.html$|njk|nunjucks/,
                exclude: [/(node_modules)/, /(src)/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-template-loader',
                        options: {
                            paths: path.resolve(__dirname, '../templates/**/'),
                            filters: nunjucksFilters,
                            data: {
                                index: {
                                    foo: 'indexBar'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: `${PATHS.src}/${PATHS.assets}/`, to: `${PATHS.assets}/` },
                { from: `${PATHS.src}/static/`, to: '' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.bundles}/css/[name].[contenthash].css`,
            chunkFilename: "[id].css"
        }),
    ]
    .concat(generateNunjucksHtml(PATHS.templatesGlob, PATHS.pages))
};