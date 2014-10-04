module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Backbone.BaseRouter v<%= meta.version %>\n'
    },

    preprocess: {
      baseRouter: {
        src: 'src/wrapper.js',
        dest: 'dist/backbone.base-router.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= meta.version %>'
        }
      },
      baseRouter: {
        src: '<%= preprocess.baseRouter.dest %>',
        dest: '<%= preprocess.baseRouter.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      baseRouter: {
        src: '<%= preprocess.baseRouter.dest %>',
        dest: '<%= preprocess.baseRouter.dest %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      baseRouter: {
        src: '<%= preprocess.baseRouter.dest %>',
        dest: 'dist/backbone.base-router.min.js',
        options: {
          sourceMap: true
        }
      }
    },

    jshint: {
      baseRouter: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/backbone.base-router.js']
      },
      tests: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/*.js']
      }
    },

    mochaTest: {
      spec: {
        options: {
          require: 'test/setup/node.js',
          reporter: 'dot',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'test/setup/helpers.js',
          'test/unit/*.js'
        ]
      }
    }
  });

  grunt.registerTask('test', 'Test the library', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', 'Build the library', [
    'test',
    'preprocess',
    'template',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', 'An alias of test', [
    'test'
  ]);
};
