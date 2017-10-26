const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const insert = require('gulp-insert');
const gulpif = require('gulp-if');


// js

const webpackConfig = {
    devtool: 'source-map',
    module: {
        rules: [
            {test: /\.pug$/, use: 'pug-loader'},
        ]
    },
    output: {
        filename: 'app.js'
    }
};

gulp.task('js:build', () => {
    return gulp.src('src/index.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulpif((file) => file.path.endsWith('.js'), insert.prepend('"use strict";\n')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js:watch', () => {
    return gulp.src('src/index.js')
        .pipe(webpack(Object.assign({}, webpackConfig, {watch: true})))
        .pipe(gulpif((file) => file.path.endsWith('.js'), insert.prepend('"use strict";\n')))
        .pipe(gulp.dest('dist/'));
});


// css

gulp.task('css:build', () => {
    const p = gulp.src('src/views/index.scss');
    return cssPipe(p);
});

gulp.task('css:build-dev', () => {
    const p = gulp.src('src/views/index.scss')
        .pipe(plumber());
    return cssPipe(p);
});

const cssPipe = (p) => {
    return p
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename('app.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
};

gulp.task('css:watch', () => {
    return gulp.watch('src/views/**/*.scss', ['css:build-dev']);
});


// html

gulp.task('html:build', () => {
    return gulp.src('src/views/index.html')
        .pipe(gulp.dest('dist/'));
});


// other files

gulp.task('other:build', () => {
    return gulp.src('src/**/*.{png,jpg,gif}')
        .pipe(gulp.dest('dist/'));
});

gulp.task('other:watch', () => {
    return gulp.watch('src/**/*.{png,jpg,gif}', ['other:build']);
});


// test

const webpackTestConfig = {
    devtool: 'source-map',
    output: {
        filename: 'test.js'
    },
    watch: true
};

gulp.task('test-js:watch', () => {
    return gulp.src('test/lib/index.js')
        .pipe(plumber())
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-html:build-dev', () => {
    return gulp.src('test/lib/**/*.{html,css}')
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-html:watch', () => {
    return gulp.watch('test/lib/**/*.{html,css}', ['test-html:build-dev']);
});


// main

gulp.task('build', ['js:build', 'css:build', 'html:build', 'other:build']);
gulp.task('watch', ['js:watch', 'css:watch', 'css:build-dev', 'html:build', 'other:watch', 'other:build']);

gulp.task('test', ['test-js:watch', 'test-html:watch', 'test-html:build-dev']);

gulp.task('default', ['build']);