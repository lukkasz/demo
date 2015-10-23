var gulp 						= require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync 		= require('browser-sync');
var del							= require('del');	
var wiredep  				= require('wiredep').stream;

var $ = gulpLoadPlugins();
var reload = browserSync.reload;

var bases = {
	app		: 'app/',
	tmp		:	'.tmp/',
	dist	: 'dist/' 
}

gulp.task('styles', function(){
	return gulp.src(bases.app + 'sass/main.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['bower_components/bootstrap-sass/assets/stylesheets/']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['last 2 version']}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(bases.tmp + 'styles'))
		.pipe(reload({stream: true}));
});

gulp.task('html', ['styles'], function(){
	var assets = $.useref.assets({searchPath: [bases.tmp, bases.app ,'.']});

	return gulp.src(bases.app + '*.html')
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.minifyCss({ 
			compability: '*',
			processImport: false
		})))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest(bases.dist));
});

gulp.task('fonts', function(){
	return gulp.src(require('main-bower-files')({
		filter: '**/*.{eot,svg,ttf,woff,woff2}'
	}).concat(bases.app + 'fonts/**/*'))
		.pipe(gulp.dest(bases.dist + 'fonts'))
		.pipe(gulp.dest(bases.tmp + 'fonts'));
});

gulp.task('images', function(){
	return gulp.src(bases.app + 'images/**/*')
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{ cleanupIDs: false }]
		}))
		.pipe(gulp.dest(bases.dist + 'images'));
});

gulp.task('extras', function(){
	return gulp.src([
		bases.app + '*.*',
		'!' + bases.app + '*.html'
	], {
		dot: true
	}).pipe(gulp.dest(bases.dist));
});

gulp.task('serve', ['styles', 'fonts'], function(){
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [bases.tmp, bases.app],
			routes: {
				'/bower_components' : 'bower_components'
			}
		}
	});

	gulp.watch([
		bases.app + '*.html',
		bases.app + 'js/*.js'
	]).on('change', reload);

	gulp.watch(bases.app + 'sass/**/*.scss', ['styles']);
	gulp.watch(bases.app + 'fonts/**/*', ['fonts']);
	gulp.watch('bower.json', ['wiredep','fonts']);

});

gulp.task('serve:dist', function(){
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: bases.dist
		}
	});
});

// Remove dist and .tmp folders
gulp.task('clean', function(){
	return del(['.tmp', 'dist']);
});

// Inject bower components
gulp.task('wiredep', function(){
	gulp.src(bases.app + '*.html')
		.pipe(wiredep({
			exclude: ['modernizr'],
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest( bases.app ));
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);
