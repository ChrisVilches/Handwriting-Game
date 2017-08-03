var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  js: 'views/js/**/*',
  less: 'views/less/**/*'
};

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(concat('styles'))
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('views/build'));
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
});

gulp.task('default', ['watch', 'less']);
