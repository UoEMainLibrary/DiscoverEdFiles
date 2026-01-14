module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          strictImports: true,
          syncImport: true,
        },
        files: {
          "gel/css/style.css": "gel/less/style.less",
          "gel/css/style-blue-bright.css": "gel/less/palette/blue-bright.less",
          "gel/css/style-blue-muted.css": "gel/less/palette/blue-muted.less",
          "gel/css/style-blue-university.css": "gel/less/palette/blue-university.less",
          "gel/css/style-brown.css": "gel/less/palette/brown.less",
          "gel/css/style-burgundy.css": "gel/less/palette/burgundy.less",
          "gel/css/style-green-dark.css": "gel/less/palette/green-dark.less",
          "gel/css/style-grey.css": "gel/less/palette/grey.less",
          "gel/css/style-jade.css": "gel/less/palette/jade.less",
          "gel/css/style-pink.css": "gel/less/palette/pink.less",
          "gel/css/style-purple.css": "gel/less/palette/purple.less",
          "gel/css/style-red.css": "gel/less/palette/red.less"
        }
      }
    },
    watch: {
      styles: {
        files: ['gel/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};
