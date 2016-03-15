var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

var destination = 'dist/';

gulp.task('server', ['build'], function() {
    nodemon({
        script: 'server.js',
        ext: 'js'
    })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
        console.log('restarted!');
    });
});

gulp.task('scripts', function() {
    return gulp.src('client/**/*.js')
        .pipe(gulp.dest(destination + 'client/'))
        .pipe(livereload());
});

gulp.task('styles', function() {
    return gulp.src('client/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(destination + 'client/'))
        .pipe(livereload());
});

gulp.task('html', function() {
    return gulp.src('client/**/*.html')
        .pipe(gulp.dest(destination + 'client/'))
        .pipe(livereload());
});

gulp.task('images', function () {
    return gulp.src('client/assets/images/**/*')
        .pipe(gulp.dest(destination + 'client/assets/images'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('client/**/*.js', ['scripts']);
    gulp.watch('client/**/*.scss', ['styles']);
    gulp.watch('client/**/*.html', ['html']);
    gulp.watch('client/assets/images/**/*', ['images']);
});

gulp.task('build', ['styles', 'scripts', 'html', 'images'])
gulp.task('default', ['server']);