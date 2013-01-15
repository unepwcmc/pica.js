module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */'
    },
    coffee: {
      src: {
        src: ['lib/**/*.js.coffee'],
        dest: 'dist/src',
        options: {
          base_path: 'lib',
          preserve_dirs: true
        }
      }
    },
    concat: {
      dist: {
        src: [
               '<banner:meta.banner>',
               'dist/src/lib/**/*.js',
               'dist/src/<%= pkg.name %>.js',
               'dist/src/models/**/*.js',
               'dist/src/views/**/*.js'
             ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'dist/src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: ['lib/**/*.coffee', 'example/**'],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {
        exports: true,
        module: false
      }
    },
    uglify: {},
    clean: {
      folder: 'dist/'
    },

    // Copy compiled JS to the example directory for use in the static
    // example
    copy: {
      dist: {
        files: {
          "example/js/lib/": "<config:concat.dist.dest>"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', 'clean lint coffee test concat min copy');

};
