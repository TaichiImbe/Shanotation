let gulp = require('gulp');
let sass = require('gulp-sass');
let gulpIf = require('gulp-if');
let ejs = require('gulp-ejs');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let plumber = require('gulp-plumber');
let notify = require('gulp-notify');
let browserify = require('browserify');
let glob = require('glob');
let source = require('vinyl-source-stream');
let transform = require('vinyl-transform');
let buffer = require('vinyl-buffer');
let minimist = require('minimist');
// let app = require('./server/app');
const babelify = require('babelify');
let nodemon = require('nodemon');

let defaultlist = ['sass', 'ejs', 'js', 'watch', 'serve'];
let buildList = ['sass', 'ejs', 'js'];
// let defaultlist = ['sass','js','serve','watch']

let options = minimist(process.argv.slice(2),{
	string: ['env'],
	default: {
		env: 'development'
	}
});

gulp.task('sass', function (err) {
    gulp.src('dev/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./views/css'));
    err();
});

gulp.task('js', function (err) {
	gulp.src('./dev/js/**/*.js')
		.pipe(gulp.dest('./views/js'));
	err();
});

gulp.task('ejs', function (err) {
    gulp.src(
        ['dev/ejs/**/*.ejs']
    )
        // .pipe(ejs())
        // .pipe(rename('index.html'))
        .pipe(gulp.dest('./views'));
    err();
});
gulp.task('serve', function (err) {
	nodemon({
		script: './app.js',
		ignore:['dev/*','node_modules/*','pdf/*','views/*'],
		env:{
			'NODE_ENV': 'development'
		},
	})
	.on('start',function(){
		console.log('start');
	})
	.on('restart',function(files){
		console.log('restart', files);
		// this.stdout.on('data',function(chunk){

		// });
		// this.stderr.on('data',function(chunk){
		// 	process.stderr.write(chunk);
		// });
	});

    // app.serve();
    err();
});

gulp.task('watch', function (err) {
    gulp.watch('dev/sass/*.scss', gulp.task(['sass']));
    gulp.watch('dev/ejs/**/*.ejs', gulp.task(['ejs']));
	gulp.watch('dev/js/**/*.js', gulp.task(['js']));
	// gulp.watch(['server/**/*.js','app.js'], gulp.task(['serve']));
    err();
});

gulp.task('default', gulp.series(gulp.parallel(defaultlist)) ,function (err) {
// gulp.task('default', gulp.series(gulp.parallel('serve')) ,function (err) {
    err();
});

gulp.task('build', gulp.series(gulp.parallel(buildList)), function (err) {
	err();
});