const gulp = require('gulp'),  //Подключаем Gulp
concat = require('gulp-concat'), //Объединение файлов
autoprefixer = require('gulp-autoprefixer'), //Добапвление префиксов
cleanCSS = require('gulp-clean-css'), //Оптимизация стилей
uglify = require('gulp-uglify'), //Оптимизация скриптов
del = require('del'), //Удаление файлов
browserSync = require('browser-sync').create(), //Синхронизация с браузером

sourcemaps = require('gulp-sourcemaps'), //Создает карту для препроцессоров стилей
sass = require('gulp-sass'), //Sass препроцессор
less = require('gulp-less'), //Less препроцессор
stylus = require('gulp-stylus'), //Stylus препроцессор

rename = require('gulp-rename'); //Модуль переименовывания файлов


//Порядок подключения файлов со стилями
const styleFiles = [
    './src/styles/style.sass'
]
//Порядок подключения js файлов
const scriptFiles = [
    './src/js/main.js'
]

//Таск для обработки стилей
gulp.task('styles', () => {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
    return gulp.src(styleFiles)
        .pipe(sourcemaps.init())
        //Указать stylus() , sass() или less()
        .pipe(sass())
        //Объединение файлов в один
        .pipe(concat('style.css'))
        //Добавить префиксы
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({
            suffix: '.min'
        }))
        //Выходная папка для стилей
        .pipe(gulp.dest('../build/css'))
        .pipe(browserSync.stream());
});

//Таск для обработки скриптов
gulp.task('scripts', () => {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(scriptFiles)
        //Объединение файлов в один
        .pipe(concat('main.js'))
        //Минификация JS
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        //Выходная папка для скриптов
        .pipe(gulp.dest('../build/js'))
        .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
    return del([
    	'../build/css/*',
    	'../build/js/*'
    	],

    	{force: true});
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "../build/"
        }
    });
    //Следить за файлами со стилями с нужным расширением
    gulp.watch('./src/styles/**/*.sass', gulp.series('styles'))
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
    //При изменении HTML запустить синхронизацию
    gulp.watch("../build/*.html").on('change', browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts'), 'watch'));
