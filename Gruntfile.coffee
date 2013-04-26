module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json')
    meta:
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */'

    clean:
      folder: ['dist/', 'test/js/']

    coffee:
      src:
        expand: true
        cwd: 'lib'
        src: '**/*.js.coffee'
        dest: 'dist/src'
        ext: '.js'
      test:
        expand: true
        cwd: 'test'
        src: '**/*.coffee'
        dest: 'test/js'
        ext: '.js'

    concat:
      coffee:
        src: [ 'lib/lib/**/*.coffee',
               'lib/<%= pkg.name %>.js.coffee',
               'lib/models/**/*.coffee',
               'lib/views/**/*.coffee' ]
        dest: 'dist/<%= pkg.name %>.coffee'
      dist:
        src: [ 'dist/src/lib/**/*.js',
               'dist/src/<%= pkg.name %>.js',
               'dist/src/models/**/*.js',
               'dist/src/views/**/*.js' ]
        dest: 'dist/<%= pkg.name %>.js'

    uglify:
      dist:
        files:
          'dist/<%= pkg.name %>.min.js': ['<%= pkg.banner %>>', '<%= concat.dist.dest %>']

    copy:
      dist:
        files:
          "example/js/lib/pica.js": "dist/pica.js"

    watch:
      files: ['lib/**/*.coffee', 'example/**/*.coffee', 'test/**/*.coffee'],
      tasks: 'default'
  )

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['clean', 'coffee', 'concat', 'uglify', 'copy'])

