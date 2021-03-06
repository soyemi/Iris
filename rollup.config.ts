import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import process from 'process';


export default{
    input: `src/index.ts`,
    output: [
        {file: 'res/iris.iife.js', name: 'iris', format: 'iife',sourcemap: false},
        {file: 'res/iris.es.js',format: 'es'}
    ],
    external: [],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: { module: 'es2015',declaration:false},
            },
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir:true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        globals()
    ]
}