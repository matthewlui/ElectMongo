var gulp = require('gulp'),
childProcess = require('child_process'),
electron = require('electron-prebuilt');

var ele; //keep an instance for kill;

gulp.task('run',function(){
    ele = childProcess.spawn(electron,['--debug-5858','./src/main'],{stdio:'inherit'});
});

gulp.task('reload',function(){
    if (!ele){
        return;
    }
    ele.kill('SIGHUP');
});

gulp.task('watch',function(){
    gulp.watch('src/db/*',['reload','run']);
    gulp.watch('src/app/js/*',['reload','run']);
    gulp.watch('src/main.js',['reload','run']);
});