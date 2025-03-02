module.exports = ({ isESM }) => {
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: isESM ? false : 'commonjs',
                    targets: {
                        browsers: [
                            "> 0.5%",
                            "last 2 versions",
                            "Firefox ESR",
                            "not dead",
                            "not IE 11"
                        ]
                    }
                },
            ],
        ],
        plugins: [
            'lodash',
            ...(isESM ? [] : ['./scripts/babel-plugin-lottie.js'])
        ]
    };
};
