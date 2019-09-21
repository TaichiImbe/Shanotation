var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpIf = require('gulp-if');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserify = require('browserify');
var glob = require('glob');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var buffer = require('vinyl-buffer');
var minimist = require('minimist');
var app = require('./app');

var defaultlist = ['sass','ejs','js','serve','watch']
// var defaultlist = ['sass','js','serve','watch']

var options = minimist(process.argv.slice(2),{
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

gulp.task('js',function(callback){
    var browserified = transform(function (filename) {
        var b = browserify(filename);
        b.add(fileName);
        return b.bundle();
    })
	var jsFiles = glob.sync('./dev/js/{!(_)*.js,**/!(_)*/!(_)*.js}');
	if(jsFiles.length === 0){
		callback();
	}

	var task_num = jsFiles.length;
	var task_executed = 0;
	var onEnd = function(){
		if(task_num === ++task_executed){
			callback();
		}
	};

	jsFiles.forEach(function(file){
		var fileName = file.replace(/.+\/(.+\.js)/, '$1');
		var filePath = '/js/';
        // console.log(file);
        // console.log(filePath);
	browserify({
		entries: file,
	})
	.bundle()
	.on('end',onEnd)
	.pipe(source(fileName))
	.pipe(buffer())
	.pipe(plumber({
		errorHandler: notify.onError('<%= error.massage %>')
	}))
	.pipe(gulpIf(
		options.env === 'staging' || options.env === 'production',
		uglify({ preserveComments: 'some'})
	))
	.pipe(gulp.dest('./views/'+filePath));	
	});
});

gulp.task('ejs', function (err) {
    gulp.src(
        ['dev/ejs/**/*.ejs', '!' + 'dev/ejs/**/*._ejs']
    )
        .pipe(ejs())
        // .pipe(rename('index.html'))
        .pipe(gulp.dest('./views'));
    err();
});
gulp.task('serve', function (err) {
    app.serve();
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
    err();
});