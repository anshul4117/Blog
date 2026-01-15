export default {
    testEnvironment: 'node',
    transform: {}, // Disable transformation for native ESM support
    verbose: true,
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/**',
        '!src/app.js',
        '!src/server.js'
    ],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // Handle import extensions
    },
};
