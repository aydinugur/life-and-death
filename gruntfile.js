// const fs = require("fs");
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: 'dist/game.zip',
                    mode: 'zip',
                    level: 9
                },
                files: [{
                    expand: true,
                    flatten: false,
                    cwd: './dist',
                    src: ['index.html', 'images/*'],
                    dest: './'
                }]
            }
        },

        processhtml: {
            dist: {
                options: {
                    process: true,
                    data: {
                        title: 'A Day In The Life',
                    }
                },
                files: {
                    'dist/index.html': ['src/production.html']
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['src/images/*'], dest: 'dist/images'},
                ],
            },
        },

        clean: ['dist*//*.min.*']


    });

    var fs = require('fs');
    grunt.registerTask('sizecheck', function () {
        var done = this.async();
        fs.stat('dist/game.zip', function (err, zip) {
            if (zip.size > 13312) {
                //If size in bytes greater than 13kb
                grunt.log.error("Zipped file greater than 13kb \x07 \n");
                grunt.log.error("WARNING! FILESIZE IS TOO BIG!");
                grunt.log.error("Zip is " + zip.size + " bytes when js13k max is 13,312 bytes");
            } else {
                grunt.log.error("Zip is " + zip.size + " bytes!");
                grunt.log.error("Filesize OK!");
            }
            done();
        });
    });
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy', 'compress', 'processhtml', 'sizecheck', 'clean']);
};
