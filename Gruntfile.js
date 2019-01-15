module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile', 'server/app.js', 'public/js/main.js', 'server/models/*.js', 'server/routes/*.js', 'server/config/*.js'],
            options: {
                'esversion': 6
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        exec: {
            // kill_docker: {
            //     command: 'docker stop $(docker ps -q)'
            // },
            build_docker: {
                command: 'docker build -t feedernet .'
            },
            run_docker: {
                command: 'docker run -p 3001:8080 --env-file ./env.list -t feedernet'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['exec']);
};
