(function(){'use strict';
	//本地存储
	var Util = (function(){
		var prefix = 'reader_';
		var storageGetter = function(key){
			return localStorage.getItem(prefix + key);
		}
		var storageSetter = function(key, val){
			return localStorage.setItem(prefix + key,val);
		}
		var storageRemove = function(key){
			return localStorage.removeItem(prefix + key);
		}
		var getBsonp = function(url, callback){
			 return $.jsonp({
		        url : url,
		        cache: true,
		        callback: 'duokan_fiction_chapter',
		        success : function(result){
		            var data = $.base64.decode(result);
		            var json = decodeURIComponent(escape(data));
		            callback(json);
		        }
		        
		    })
		}
		return {
			storageGetter : storageGetter,
			storageSetter : storageSetter,
			storageRemove : storageRemove,
			getBsonp : getBsonp
		}
	})();
	
	var Dom = {
		navHeader : $("#nav-header"),
		navFooter : $("#nav-footer"),
		fontPanelParent : $(".font-panel-parent"),
		readerContainer : $('#reader_container'),
		night : $("#itemNight"),
		day : $("#itemDay")
	};
	
	var BgColor = ['#f7eee5', '#e9dfc7', '#a4a4a4', '#cdefce', '#283548'];
	
	var Win = $(window);
	var Bd = $('body');
	var ReaderModel;
	var ReaderUI;
	
	
	
//	这里有一个问题，这里面我定义的参数都是全局变量，这样我在后面的方法里面才能调用到它，要不要把它们封装起来?
	var initFontSize = Util.storageGetter('fontSize');
	//initFontSize是设置小说的字体的属性
	initFontSize = parseInt(initFontSize);
	if(!initFontSize){
		var initFontSize = 14;
	}
	Dom.readerContainer.css('font-size',initFontSize);
	
	var col = Util.storageGetter('bgColor');
	//col是背景颜色的属性
	if(!col){
		var col = '#e9dfc7';
	}
	Bd.css('background',col);

	//检测localstorage保存的内容是否存在，不存在时isNight为false
	var isNight = Util.storageGetter('nightIs');
	//这个参数是检测是否是夜间模式的
	if(!isNight){
		isNight = false;
	}
	//当isNight为true时，执行代码
	if(isNight == 'true'){
		Dom.day.show();
		Dom.night.hide();
		Bd.css('background','#0f1410');
		Bd.css('color','#4e5339');
	} 
	
	
	
	
	
	
	
	
	main();
	
	function main(){
		//入口函数
		ReaderModel = readerModel();
		ReaderUI = readerBaseFrame(Dom.readerContainer);
		ReaderModel.init(function(data){
			ReaderUI(data);
		});
		readerEvent();
	}
	
	function readerModel(){
		//数据交互
		
        var Chapter_id;
        var Chapters = 4;
        
        var init = function(UIcallback){
            getFictionInfo(function(){
                getCurChapterContent(Chapter_id,function(data){
                    //todo...
                    UIcallback && UIcallback(data);
                })
            })

			
        }
        //获取章节列表信息
		var getFictionInfo = function(callback){
		    $.get('/ajax/chapter',function(data){
		        //todo 获取信息后的回调
		        if(!Util.storageGetter('chapterId')){
		        	Chapter_id = 1;
		        }else{
		        	Chapter_id = parseInt(Util.storageGetter('chapterId'),10);
		        }
		        
		        callback && callback(data);
		    },'json');
		}
		
		
		
		//获得当前章节内容
		var getCurChapterContent = function(chapter_id,callback){
		    $.get('/ajax/chapter_data',{
		    	id : Chapter_id
		    },function(data){
		        if(data.result == 0){
		            var url = data.jsonp;
		            Util.getBsonp(url, function(data){
		                callback && callback(data); 
		            });
		        }
		    },'json');
		}
		
		
		var prevChapter = function(UIcallback){
			if(Chapter_id === 1){
		        return;
		    }
		    Chapter_id --;
		    getCurChapterContent(Chapter_id,UIcallback);
		    Util.storageSetter('chapterId',Chapter_id);
		}
		
		var nextChapter = function(UIcallback){
			if(Chapter_id === 4){
		        return;
			}
			Chapter_id ++;
		    getCurChapterContent(Chapter_id,UIcallback);
			Util.storageSetter('chapterId',Chapter_id);
		}
		
		return{
		    init : init,
		    prevChapter : prevChapter,
		    nextChapter : nextChapter
		}
		
		
	}
	
	function readerBaseFrame(container){
		//渲染UI
		function parseChapterData(jsonData){
			var jsonObj = JSON.parse(jsonData);
			var html = '<h4>' + jsonObj.t + '</h4>';
			for(var i=0; i<jsonObj.p.length; i++){
				html += '<p>' + jsonObj.p[i] + '</p>';
			}
			return html;
		}
		return function(data){
			container.html(parseChapterData(data));
		}
	}
	
	function readerEvent(){
		//交互事件绑定
		$("#action_mid").click(function(){
			if(Dom.navHeader.css('display') == 'none'){
				Dom.navHeader.show();
				Dom.navFooter.show();
			} else {
				Dom.navHeader.hide();
				Dom.navFooter.hide();
			}
			if(Dom.fontPanelParent.css('display') == 'block'){
				Dom.fontPanelParent.hide();
				$('#action_font').removeClass('change-color');
			}
		});
		
		$('#itemFont').click(function(){
			if(Dom.fontPanelParent.css('display') == 'none'){
				Dom.fontPanelParent.show();
				$('#action_font').addClass('change-color');
			}else{
				Dom.fontPanelParent.hide();
				$('#action_font').removeClass('change-color');
			}
		});
		
		Win.scroll(function(){
			Dom.navHeader.hide();
			Dom.navFooter.hide();
			Dom.fontPanelParent.hide();
			$('#action_font').removeClass('change-color');
		})
		
		$('#largeBtn').click(function(){
			if(initFontSize > 20){
				return;
			}
			initFontSize ++;
			Dom.readerContainer.css('font-size',initFontSize);
			Util.storageSetter('fontSize',initFontSize);
		});
		$('#smallBtn').click(function(){
			if(initFontSize < 11){
				return;
			}
			initFontSize --;
			Dom.readerContainer.css('font-size',initFontSize);
			Util.storageSetter('fontSize',initFontSize);
		});
		
		$("#bg-color li").click(function(){
			var index = $(this).index();
			var i = index;
			col = BgColor[i];
			Bd.css('background',col);
			Util.storageSetter('bgColor',col);
		});
		
		
		//点击按钮时变为夜间模式
		$("#day_night_btn").click(function(){
			if(Dom.day.css('display') == 'none'){
				Dom.day.show();
				Dom.night.hide();
				Bd.css('background','#0f1410');
				Bd.css('color','#4e5339');
				isNight = true;
				Util.storageSetter('nightIs',isNight);
				
			}else{
				Dom.day.hide();
				Dom.night.show();
				Bd.css('background','#E9DFC7');
				Bd.css('color','#555555');
				isNight = false;
				Util.storageRemove('nightIs');
				
			}
		});
		
		//上下翻页
		$('#prev-btn').click(function(){
			ReaderModel.prevChapter(function(data){
				ReaderUI(data);
			});
		});
		
		$('#next-btn').click(function(){
			ReaderModel.nextChapter(function(data){
				ReaderUI(data);
			});
		});
	}
})();