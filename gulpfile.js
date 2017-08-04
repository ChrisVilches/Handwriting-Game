var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  js: 'views/js/**/*',
  less: 'views/less/**/*',
  lessImporter: 'views/less/main.less',
  build: 'views/build'
};

gulp.task('less', function() {
  return gulp.src(paths.lessImporter)
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.build));
});

gulp.task('build', ['less']);

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
});

gulp.task('default', ['watch', 'less']);
