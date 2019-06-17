const {src, dest, parallel, watch} = require("gulp");
const sass = require("gulp-sass");
const minifyCSS = require("gulp-csso");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


function css(){
  return watch("public-src/scss/**.scss", () => {
    return src("public-src/scss/**.scss")
      .pipe(sass())
      .pipe(concat("public.min.css"))
      .pipe(minifyCSS())
      .pipe(dest("public/css"));
  });
}


exports.css = css;
exports.default = parallel(css);
