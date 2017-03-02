$.get('/ajax/index',function(d){
	var windowWinth = $(window).width();
	if(windowWinth<320){
		windowWinth = 320;
	}
	var offset = $($('.Swipe-tab').find('a')[0]).offset();
	var index_header_tab_width = offset.width;
	new Vue({
		el: '#app',
		data: {
			index_header_tab_width: index_header_tab_width,
			screen_width: windowWinth,
			double_screen_width: windowWinth*2,
			top: d.items[0].data.data,
			hot: d.items[1].data.data,
			recommend: d.items[2].data.data,
			female: d.items[3].data.data,
			male: d.items[4].data.data,
			free: d.items[5].data.data,
			topic: d.items[6].data.data,
			duration:0,
			position:0,
			header_position:0,
			header_duration:0,
			tab_1_class:'tab-on',
			tab_2_class:''
		},
		methods:{
			tabSwitch:function(position){
				this.duration = 0.5;
				this.header_duration = 0.5;
				if(position == 0){
					this.position = 0;
					this.header_position = 0;
				}else if(position == 1){
					this.position = -windowWinth;
					this.header_position = index_header_tab_width;
				}
			}
		}
	})
},'json');