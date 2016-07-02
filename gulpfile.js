var gulp = require('gulp'),
childProcess = require('child_process'),
jsdoc = require('gulp-jsdoc3');
electron = require('electron-prebuilt');

var ele; //keep an instance for kill;

gulp.task('run',function(){
    ele = childProcess.spawn(electron,['--debug-5858','./src/main'],{stdio:'inherit'});
});

gulp.task('doc',function(){
    return gulp.src(["./src/*/*/*.js","./src/*.js"],{read:false})
           .pipe(jsdoc());
});

gulp.task('reload',function(){
    if (!ele){
        return;
    }
    ele.kill('SIGHUP');
});

gulp.task('watch',function(){
    var task = ['reload','run','doc'];
    gulp.watch('src/db/*',task);
    gulp.watch('src/app/js/*',task);
    gulp.watch('src/main.js',task);
});