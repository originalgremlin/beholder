// https://github.com/jrburke/r.js/blob/master/build/example.build.js
//
// To build using the closure compiler from project root:
// java -classpath scripts/build/js.jar:scripts/build/compiler.jar org.mozilla.javascript.tools.shell.Main /usr/local/bin/r.js -o scripts/build.js

({
    closure: {
        CompilerOptions: { },
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING'
    },
    inlineText: true,
    logLevel: 2,
    name: 'main',
    optimize: 'closure',
    out: '../static/scripts/main.js',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore.custom'
    },
    preserveLicenseComments: false,
    useStrict: true,
    wrap: true
})
