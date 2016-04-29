var api = {};

// 动画库
api.animate = {
	// 轮播组件
	carousel: {
		/*
		 * options参数:
		 * 	promoId  轮播外层div的ID 
		 *  autoPlay 是否自动轮播 true|false, 默认true
		 *  time     轮播间隔时间,单位为毫秒，默认2000ms
		 *  playNav	 是否需要轮播导航，true|false,默认false
		*/
		init: function(options){
			if(!options.promoId) return;
			var promoBox = $('#'+options.promoId);
			var isAutoPlay = true, //默认自动轮播
				playNav = false;  //默认存在导航
				time = 2000,
				liH = 0,
				liW = 0,
				imgW = 0,
				startNum = 0,   //初始化前图片个数
				liNum = 0,		//初始化后图片个数
				playNavBox = null,
				playNavCon = '';
			var imgList = promoBox.find('.u-imglst');
			var firstLi = imgList.find('li').first().clone();
			var lastLi = imgList.find('li').last().clone();
			var docW = $(document).width();
			promoBox.index = 1;
			promoBox.timer = null;  //定时器对象
			promoBox.options = options;

			//参数处理
			if(typeof options.autoPlay == 'boolean'){
				isAutoPlay = options.autoPlay;
			}
			if(typeof options.time == 'number'){
				time = options.time;
			}
			if(typeof options.playNav == 'boolean'){
				playNav = options.playNav;
			}

			//初始化
			startNum = imgList.find('li').size();
			if(startNum > 1){
				imgList.append(firstLi);  //最前面添加最后一张图
				imgList.prepend(lastLi);  //最后面添加第一张图
			}

			//轮播导航
			if(playNav && startNum > 1){
				playNavBox = $('<div class="u-nav">');
				promoBox.find('.m-prm').append(playNavBox);
				for(var i=0; i<startNum; i++){
					playNavCon += '<i></i>';
				}
				playNavBox.append(playNavCon);
				playNavBox.find('i').first().addClass('cur');
				this.playNavClick(promoBox);
			}

			// 图片自适应宽度
			autoSize();

			function autoSize(){
				liNum = imgList.find('li').size();
				imgList.find('img').css('width', docW);
				liH = firstLi.outerHeight(true) || imgList.find('li').height(); //有些时候无法找到firstLi的高度
				liW = firstLi.outerWidth(true) || imgList.find('li').width();	
			}
			if(startNum > 1){
				imgList.css('left', -liW);
			}
			promoBox.css('height', liH);
			imgList.css('width', liNum * liW);

			if(startNum == 1) return;
			//左右箭头状态
			this.arrowStatus(promoBox, isAutoPlay, time);
			//左右轮播图切换
			this.picSwitch(promoBox);
			//自动轮播
			if(isAutoPlay){
				this.autoPlay(promoBox, time);
			}
		},
		//左右箭头状态
		arrowStatus: function(box, isAutoPlay, time){
			var arrow = box.find('.u-arrow');
			var _this = this;
			// 移入
			box.on('mouseover', function(){
				arrow.show();
				clearInterval(box.timer);
			});
			// 移出
			box.on('mouseout', function(){
				arrow.hide();
				if(isAutoPlay){
					_this.autoPlay(box, time);
				}
			});
		},
		// 图片左右移动函数封装
		picMove: function(box, des){
			var picList = box.find('.u-imglst');
			var playNavBox = box.find('.u-nav');
			var maxIndex = 0,
				iW = 0;
			if(picList.is(':animated') ) return;  //如果正在轮播动画正在执行，则返回空

			maxIndex = picList.find('li').size();
			iW = picList.find('li').eq(0).width();

			if(des == 'left'){
				box.index++;
			}else if(des == 'right'){
				box.index--;
			}

			picList.animate({
				left: -box.index * iW
			},500, function(){
				var listLeft = parseFloat(picList.css('left'));
				var maxLeft = -iW*(maxIndex-1);
				if(listLeft == maxLeft && des == 'left'){
					picList.css('left', -iW);
					box.index = 1;
				}
				if(listLeft == 0 && des == 'right'){
					picList.css('left', maxLeft + iW);
					box.index = maxIndex - 2;
				}
				playNavBox.find('i').eq(box.index - 1).addClass('cur')
									 .siblings().removeClass('cur');	
			})
		},
		//左右轮播图切换
		picSwitch: function(box){
			var arrow = box.find('.u-arrow');
			var arrowL = arrow.eq(0);
			var arrowR = arrow.eq(1);
			var picList = box.find('.u-imglst');
			var _this = this;

			//左轮播
			arrowL.on('click', function(){
				_this.picMove(box, 'left');
			});

			//右轮播
			arrowR.on('click', function(){
				_this.picMove(box, 'right');
			});
		},
		//自动轮播
		autoPlay: function(box, time){
			var _this = this;
			var navItems = box.find('.u-nav i');
			box.timer = null;
			box.timer = setInterval(function(){
				_this.picMove(box, 'left');
			}, time)
		},
		//点击导航圆点
		playNavClick: function(box){
			var _this = this;
			var navItems = box.find('.u-nav i');
			$.each(navItems, function(i,obj){
				$(obj).on('click', function(){
					box.index = $(this).index();
					navItems.removeClass('cur');
					$(this).addClass('cur');
					_this.picMove(box, 'left');
				})
			})
		}
	}
}