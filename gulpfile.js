// This is a mix of my own old gulp file and this one here:
// https://github.com/rioki/www.rioki.org/blob/master/gulpfile.js

var gulp = require('gulp');

// Javascript
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

//SASS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

// Server
var connect = require('gulp-connect');

// Utility
var del = require('del');
var rename = require('gulp-rename');

var paths = {
	scripts: 'src/assets/js/**/*',
	styles: 'src/assets/styles/**/*',
};

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(scripts, styles, page)
));
gulp.task(watch);

gulp.task('default', gulp.series('build'));

function clean(done) {
	del(['build'], done);
}

function page() {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('build'));
}

function scripts() {
	return gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest('build/assets/js'));
}

function styles() {
	return gulp.src('src/assets/styles/*.scss')
		.pipe(sass())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('build/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('build/assets/css'));
}

function watch() {
	gulp.watch(paths.scripts, scripts);
	gulp.watch(paths.styles, styles);
	gulp.watch('src/*.html', page);

	connect.server({
		root: 'build',
		livereload: true
	});
}
