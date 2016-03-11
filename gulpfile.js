var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('nodemon');

var destination = 'dist/';

// gulp.task('server', function() {
//     var app, base, directory, hostname, port;
//     port = 4000;
//     hostname = null;
//     base = path.resolve('.');
//     directory = path.resolve('.');
//     app = connect()
//             .use(connect["static"](base))
//             .use(connect.directory(directory));
//     return http.createServer(app)
//             .listen(port, hostname);
// });

// gulp.task('livereload', function() {
//     return server.listen(35729, function(err) {
//         if (err != null) {
//         return console.log(err);
//         }
//     });
// });

gulp.task('scripts', function() {
    return gulp.src('client/**/*.js')
        .pipe(gulp.dest(destination + 'client/'))
        .pipe(livereload());
});

gulp.task('styles', function() {
    return gulp.src('client/**/*.less')
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
    gulp.watch('client/**/*.js', ['scripts']);
    gulp.watch('client/**/*.sass', ['styles']);
    gulp.watch('client/**/*.html', ['html']);
    gulp.watch('client/assets/images/**/*', ['images']);
});

gulp.task('default', ['styles', 'scripts', 'html', 'images', 'watch']);