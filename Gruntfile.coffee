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
        cwd: 'coffee'
        src: '**/*.coffee'
        dest: 'js'
        ext: '.js'
      test:
        expand: true
        cwd: 'spec/coffee'
        src: '**/*.coffee'
        dest: 'spec/js'
        ext: '.js'

    copy:
      dist:
        files:
          "example/js/lib/pica.js": "dist/pica.js"

    watch:
      files: ['coffee/**/*.coffee', 'example/**/*.coffee', 'spec/coffee/**/*.coffee'],
      tasks: 'default'

    coffeelint:
      files: ['coffee/**/*.coffee', 'example/**/*.coffee', 'spec/coffee/**/*.coffee'],
      options:
        'no_trailing_whitespace': {'level': 'error'},
        'no_empty_param_list': {'level': 'warning'},
        'cyclomatic_complexity' : {'level' : 'warn', 'value' : 11},
        'max_line_length': {'level': 'warn'}

    # Optimization and build.
    requirejs:
      options:
        baseUrl: "js"
      compress_no_dependencies:
        options:
          optimize: 'uglify2'
          out: "dist/pica.min.js"
          mainConfigFile: 'js/app.js'
          exclude: [
            'jquery',
            'jQueryXDomainRequest',
            'leaflet',
            'leaflet_draw'
          ]
      plain_no_dependencies:
        options:
          optimize: 'none'
          out: "dist/pica.js"
          mainConfigFile: 'js/app.js'
          exclude: [
            'jquery',
            'jQueryXDomainRequest'
            'leaflet',
            'leaflet_draw'
          ]
      #css:
      #  options:
      #    optimizeCss: "standard"
      #    cssIn: "style/main.css"
      #    out: "dist/main.css"
  )

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-requirejs')

  grunt.registerTask('default', ['coffee', 'copy'])

