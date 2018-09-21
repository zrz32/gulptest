//引入gulp和gulp插件
var gulp = require('gulp'),
runSequence = require('run-sequence'),
rev = require('gulp-rev'),
revAppend = require('gulp-rev-append');
revCollector = require('gulp-rev-collector'),
//rename = require('gulp-rename'),
//uglify = require('gulp-uglify'),
clean = require('gulp-clean'),
//pump = require('pump'),
watch = require('gulp-watch'),
//jshint = require('gulp-jshint')
//cleanCSS = require('gulp-clean-css');;

//定义css、js源文件路径
cssSrc = 'src/**/*.css',
jsSrc = ['src/**/*.js','!gulpfile*.js'];


//监控文件变化
gulp.task('watch', function () {
    gulp.watch([jsSrc,cssSrc], ['default']);
});

//检查js语法
// gulp.task('jslint', function() {
//   return gulp.src(jsSrc)
//   .pipe(jshint())
//   .pipe(jshint.reporter('default'));
// });

//清空目标文件
gulp.task('cleanDst', function () {
    return gulp.src(['dist','rev'], {read: false})
    .pipe(clean());
});



//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
    return gulp.src(cssSrc)
    .pipe(rev())
    // 压缩css
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){

    return gulp.src(jsSrc)
    .pipe(rev())
    //压缩
    //.pipe(uglify())
    .pipe(gulp.dest('dist'))
     //生成rev-manifest.json
     .pipe(rev.manifest())
     .pipe(gulp.dest('rev/js'));
 });


//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json','dist/**/*.html'])
    .pipe(revCollector({
        replaceReved: true
    }))
    .pipe(gulp.dest('dist'));
});
/*=====================压缩html==========================*/
gulp.task('miniHtml', function() {
    return gulp.src('dist/**/*.html')
        .pipe(revAppend())
        .pipe(gulp.dest('dist'));
});

// 将非js、非css移动到目标目录
gulp.task('mvNotDealAsset', function () {
    return gulp.src(['src/**/*','!src/**/*.css', '!src/**/*.js','!src/**/*.html'])
    .pipe(gulp.dest('dist'));
});


//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['cleanDst'],
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        ['mvNotDealAsset'],
        ['watch'],
        done);
});


gulp.task('default', ['dev']);