var gulp = require('gulp'),
childProcess = require('child_process'),
electron = require('electron-prebuilt');

var ele; //keep an instance for kill;

gulp.task('run',function(){
    ele = childProcess.spawn(electron,['--debug-5858','./bin/main'],{stdio:'inherit'});
});

gulp.task('reload',function(){
    if (!ele){
        return;
    }
    ele.kill('SIGHUP');
});

gulp.task('watch',function(){
    gulp.watch('bin/db/*',['reload','run']);
    gulp.watch('bin/app/js/*',['reload','run']);
    gulp.watch('bin/main.js',['reload','run']);
});