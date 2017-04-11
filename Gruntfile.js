module.exports = function(grunt) {
 
    // 配置任务参数
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
//        concat: {
//    	  options: {
//    	    // 定义一个用于插入合并输出文件之间的字符
//    	    separator: ';'
//    	  },
//    	  dist: {
//    	    // 将要被合并的文件
//    	    src: ['css/*.css'],
//    	    // 合并后的JS文件的存放位置
//    	    dest: 'css/base.css'
//    	  }
//    	},
        jshint: {
    	  // define the files to lint
          // album.js ,myemail.js ,dynamic.js 不压缩
    	  files: ['gruntfile.js', 
    	          'js/core/**/*.js', 
    	          'js/page/**/*.js',
    	          'js/util/**/*.js',
    	          'js/zone/**/*.js'],
    	  // configure JSHint (documented at http://www.jshint.com/docs/)
    	  options: {
    	      // more options here if you want to override JSHint defaults
    	    globals: {
    	      jQuery: true,
    	      console: true,
    	      module: true
    	    }
    	  }
    	},
//    	uglify: {
//		  options: {
//			mangle: false,
//		    // 此处定义的banner注释将插入到输出文件的顶部
//		    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//		  },
//		  dist: {
//		    files: {
//		      'spread/oliveroom.js':['spread/oliveroom.js'],
//		    }
//		  }
//		},
    	uglify: {
            options: {
            	// 此处定义的banner注释将插入到输出文件的顶部
    		    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            	mangle: false, //不混淆变量名
            },
            dist: {
    		    files: {
    		    }
            },
            core: {//任务三：按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand:true,
                    cwd:'js/core',//js目录下
                    src:'**/*.js',//所有js文件
                    dest:'js/core'//输出到此目录下
                }]
            },
            util:{
            	files:[{
            		expand:true,
            		cwd:'js/util',
            		src:'**/*.js',
            		dest:'js/util'
            	}]
            },
            page:{
            	files:[{
            		expand:true,
            		cwd:'js/page',
            		src:'**/*.js',
            		dest:'js/page'
            	}]
            },
            zone:{
            	files:[{
            		expand:true,
            		cwd:'js/zone',
            		src:'**/*.js',
            		dest:'js/zone'
            	}]
            }
            
        },
        cssmin: {
  		  options: {
		    // 此处定义的banner注释将插入到输出文件的顶部
		    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
		    compatibility : 'ie8', //设置兼容模式 
		    noAdvanced : true //取消高级特性 
		  }, 
		  css:{
			  files:[{
				  expand:true,
				  cwd:'css',
				  src:'**/*.css',
				  dest:'css'
			  }]
		  }
        }
		
    });
 
    // 插件加载（加载  模块）
    grunt.loadNpmTasks('grunt-contrib-jshint');
//    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 自定义任务：通过定义 default 任务，可以让Grunt默认执行一个或多个任务。
//    grunt.registerTask('default', ['jshint','concat','uglify','cssmin']);
    grunt.registerTask('default', ['cssmin','uglify']);
    //压缩单个文件
    //grunt.registerTask('default', ['uglify']);
 
};