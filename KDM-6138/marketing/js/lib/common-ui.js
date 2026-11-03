(function($){

	/* tab js */
	var ui_tab = (function(){
		var el, tab_list, tab_cont, tab_idx;

		function init(){
			el = $('.ui_tab');
			tab_list = el.find('li');
			tab_cont = el.find('.tab_cont');

			clickEvent();
		}

		function clickEvent(){
			tab_list.find('a').on('click', function(e){
				e.preventDefault();
				tab_idx = $(this).closest('li').index();

				tab_list.removeClass('on');
				$(this).closest('li').addClass('on');
				tab_cont.removeClass('on')
				tab_cont.eq(tab_idx).addClass('on');
			})
		}

		return{init:init}
	})();

	// radio
	var ui_radio = (function(){
		var el, el_radio, idx;

		function init(){
			el = $('.ui_radio');
			el_radio = el.find('input:radio');

			bindEvent();
		}

		function bindEvent(){
			loadCheck();
			radioCheck();
		}

		//radio click check
		function radioCheck(){
			el_radio.on('click', function(){
				$('.radio').removeClass('on');
				if($(this).is(':checked')){
					$(this).closest('.radio').addClass('on');
				}
			});
		}

		//page load radio check
		function loadCheck(){
			el.find('input:checked').closest('.radio').addClass('on');
		}

		return{init:init}
	})();

	//checkbox
	var ui_checkBox = (function(){
		var el, el_checkBox;

		function init(){
			el = $('.ui_chkbox')
			el_checkBox = el.find('input:checkbox');

			checkEvent();
		}

		function checkEvent(){
			el_checkBox.on('click', function(){
				$(this).prop('checked', true);
				if($(this).closest('.chkbox').hasClass('on')){
					$(this).closest('.chkbox').removeClass('on');
					$(this).prop('checked', false);
				}
				if($(this).is(':checked')){
					$(this).closest('.chkbox').addClass('on');
				}
			});
		}

		return{init:init}
	})();

	// checkbox
	var CheckboxUI = function(){
		var el;
		var $input, $text;
		var checked, disabled;

		function init(_el){
			el = $(_el);

			setup();
			el.addClass('ui_complete');

			return this;
		}

		function setup(){
			$input = el.find('input:checkbox');
			$text = el.find('label > span');

			refresh();

			bindEvents();
		}

		function bindEvents(){
			$input.on('focusin', function(e){
				$text.addClass('focus');
			}).on('focusout', function(e){
				$text.removeClass('focus');
			}).on('change', function(e){
				refresh();
			});
		}

		function refresh(){
			checked = $input.prop('checked') || $input.prop('checked') == 'checked';
			disabled = $input.prop('disabled') || $input.prop('disabled') == 'disabled';

			/*
			기본형: .checkbox_basic
			비활성: .checkbox_disabled
			체크: .checkbox_checked
			비활성체크: .checkbox_disabled_checked
			*/

			$text.removeClass('checkbox_basic checkbox_disabled checkbox_checked checkbox_disabled_checked');
			if(checked && disabled){
				$text.addClass('checkbox_disabled_checked');
			}else if(checked){
				$text.addClass('checkbox_checked');
			}else if(disabled){
				$text.addClass('checkbox_disabled');
			}else{
				$text.addClass('checkbox_basic');
			}
		}

		return {
			init: init
			, refresh: refresh
		};
	};

	// radio
	var RadioUI = function(){
		var el;
		var $input, $text, $radioSet;
		var checked, disabled;

		function init(_el){
			el = $(_el);

			setup();
			el.addClass('ui_complete');

			return this;
		}

		function setup(){
			$input = el.find('input:radio');
			$text = el.find('label > span');
			if($input.attr('name')){
				$radioSet = $('.input_radio input[name=' + $input.attr('name') + ']');
			}else{
				$radioSet = $;
			}


			refresh();

			bindEvents();
		}

		function bindEvents(){
			$input.on('focusin', function(e){
				$text.addClass('focus');
			}).on('focusout', function(e){
				$text.removeClass('focus');
			}).on('change', function(e){
				$radioSet.each(function(idx, obj){
					$(obj).data('radio').refresh();
				});
			});
		}

		function refresh(){
			checked = $input.prop('checked') || $input.prop('checked') == 'checked';
			disabled = $input.prop('disabled') || $input.prop('disabled') == 'disabled';

			/*
			기본형: .radio_basic
			비활성: .radio_disabled
			체크: .radio_checked
			비활성체크: .radio_disabled_checked
			*/

			/*$text.removeClass('radio_basic radio_disabled radio_checked radio_disabled_checked');
			if(checked && disabled){
				$text.addClass('radio_disabled_checked');
			}else if(checked){
				$text.addClass('radio_checked');
			}else if(disabled){
				$text.addClass('radio_disabled');
			}else{
				$text.addClass('radio_basic');
			}*/
		}

		return {
			init: init
			, refresh: refresh
		};
	};

	// form controls
	var formControl = (function(){
		var selectEl, checkEl, radioEl;

		function init(){
			// selectEl = $('.:not(.ui_complete)');
			checkEl = $('.input_checkbox:not(.ui_complete)');
			radioEl = $('.input_radio:not(.ui_complete)');

			// initSelect();
			initCheckbox();
			initRadio();
		}

		// function initSelect(){
		// 	selectEl.each(function(idx, obj){
		// 		var $obj = $(obj);
		// 		var $select = $obj.find('select');

		// 		var selectbox = new SelectboxUI();
		// 		selectbox.init($obj);
		// 		$select.data('selectbox', selectbox);
		// 	});
		// }

		function initCheckbox(){
			checkEl.each(function(idx, obj){
				var $obj = $(obj);
				var $input = $obj.find('input');

				var checkbox = new CheckboxUI();
				checkbox.init($obj);
				$input.data('checkbox', checkbox);
			});
		}

		function initRadio(){
			radioEl.each(function(idx, obj){
				var $obj = $(obj);
				var $input = $obj.find('input');

				var radio = new RadioUI();
				radio.init($obj);
				$input.data('radio', radio);
			});
		}

		return {init: init}
	})();

	window.popupManger = (function(){
		var el;
		var _focusEl;

		function init(){
			// el = $('');
			// 테스트용
			if($('.ui_page_popup').length){
				/*
				$('body').append('<div style="position:fixed;left:10px;top:10px;z-index:9999;background-color:#f50;width:100px;"><a id="btnPopupTest" href="#" style="display:block;">�앹뾽 �닿린 �뚯뒪��/a></div>');

				$('#btnPopupTest').on('click', function(e){
					e.preventDefault();

					show();
					// refresh();
				});
				*/
			}
			//// 테스트용

			bindEvents();
		}

		function bindEvents(){
			// 딤드 클릭시 팝업창 닫기
			$('.ui_page_popup .dimm').off('click').on('click', function(e){
				hide();
			});
		}

		// 팝업 열기
		function show(focusEl){
			// 호출된 포커스 저장(접근성)
			_focusEl = focusEl;

			$('.ui_page_popup iframe').css({width: 773});
			/*$('.ui_page_popup iframe').hide();*/
			$('.ui_page_popup .loading').show();
			$('.ui_page_popup').show();

			// 오른쪽 스크롤 너비 계산
			// 스크롤 없는 페이지일 경우에 재계산 필요
			var paddingRightValue = 8;
			if($('html').hasClass('ie8')){
				paddingRightValue = 9;
			}
			$('html, body').css({overflow: 'hidden', paddingRight: paddingRightValue});
		}

		// 팝업 닫기
		function hide(){
			$('.ui_page_popup').hide();
			$('html, body').css({overflow: 'initial', paddingRight: 'initial'});

			// 저장된 포커스로 이동(접근성)
			if(_focusEl && _focusEl.length){
				_focusEl.focus();
			}
		}

		// 팝업 높이 재계산
		function refresh(){
			var iframeContent = $('.ui_page_popup').find('iframe').contents();
			var iframeHeight = iframeContent.find('html').height();
			var windowHeight = window.innerHeight || $(window).height();

			$('.ui_page_popup iframe').css({width: 774});
			$('.ui_page_popup .loading').hide();
			$('.ui_page_popup iframe').show();

			if(iframeHeight + 100 < windowHeight){
				// 가운데 정렬
				// $('.ui_page_popup').css({height: iframeHeight});
				$('.ui_page_popup iframe').css({height: iframeHeight});
				$('.ui_page_popup .popup_area').css({height: iframeHeight, marginTop: (windowHeight - iframeHeight)/2});
			}else{
				// 최대 높이로
				$('.ui_page_popup iframe').css({height: windowHeight - 100});
				$('.ui_page_popup .popup_area').css({marginTop: 50});
			}
		}

		return {
			init: init
			, refresh: refresh
			, show: show
			, hide: hide
		}
	})();

	//셀렉트 옵션 및 접근성
	var ui_selectText = (function(){
		var el, el_select, sltOption, el_txt;

		function init(){
			el = $('.ui_select');
			el_select = el.find('select');
			el_txt = el.find('.option_txt');

			optionSelect();
		}

		function optionSelect(){
			el_select.each(function(){
				sltOption = $(this).find('option:selected').text();
				$(this).next(el_txt).text(sltOption).attr('aria-hidden','false');
			});
			el_select.on('change', function(){
				sltOption = $(this).find('option:selected').text();
				$(this).next(el_txt).text(sltOption);
			});
		}

		function refresh(){
			el_select.each(function(){
				sltOption = $(this).find('option:selected').text();
				$(this).next(el_txt).text(sltOption);
			});
		}

		return{init:init,
				refresh : refresh
		}

	})();

	// tooltip
	var tooltip = (function(){
		var el, btn_close;

		function init(){
			el = $('.tooltip_area');
			btn_close = el.find('.tooltip');
			classEvent();
		}

		function classEvent(){
			el.find('.btn_tooltip').on('click', function(e){
				e.preventDefault();
				$('.tooltip_area').removeClass('on');
				$(this).closest('.tooltip_area').addClass('on');
			});
			btn_close.on('click', function(e){
				e.preventDefault();
				$(this).closest('.tooltip_area').removeClass('on');
			});

		}

		return{init:init}
	})();

	// tooltip02
	var tooltip02 = (function(){
		var el, tooltip_el;
		var currentScrollTop;

		function init(){
			el = '.ico_tip';

			$(document).on('click', el, function(e){
				e.preventDefault();

				var _this = $(this);
				tooltip_el = $('.' + _this.data('tooltip-class'));

				// 해당 하는 툴팁 내용 요소가 있다면
				if(tooltip_el.length){
					currentScrollTop = $(window).scrollTop();
					// 다시 툴팁을 눌렀다면
					if(tooltip_el.is(':visible')){
						tooltip_el.hide();
					}else{
						// 모든 툴팁 제거
						$(document).find('.wrap_popup').hide();

						tooltip_el.show();
						$('.dimm').show();
						$(window).scrollTop(0);

						// 클릭한 곳 주변에 띄운다
						$('.pop_container').attr({'aria-hidden': 'true'});
						setTimeout(function(){
						//	tooltip_el.find('.box_pop_head').attr({role: 'text', tabindex: 0}).focus();
						tooltip_el.find('.box_pop_head').attr({role: 'text'}).focus();
						}, 100);

						// 툴팁 닫기
						tooltip_el.on('click', '.box_btn_close,.btn-close', function(e){
							e.preventDefault();

							tooltip_el.hide();
							$('.dimm').hide();
							tooltip_el.off('click');
							
							$(window).scrollTop(currentScrollTop);
							$('.pop_container').attr({'aria-hidden': 'false'});
							setTimeout(function(){
								_this.focus();
							}, 100);
						});
					}
				}
			});
		}

		return{init:init}
	})();

	//iframe load
	var iframeLoad = (function(){
		var el_frame, frameH;
		function init(){
			el_frame = $('.cont_frame');

			event();
		}
		function event(){
			el_frame.load(function(){    // iframe이 모두 load된후 제어 임시
		    		frameH = $(this).contents().find('.cont_wrap').outerHeight();
				el_frame.css({
					height : frameH,
					display : 'block'
				});
			});
		}
		return{init:init}
	})();

	$(function(){
		ui_tab.init(); 												//tab js
		ui_radio.init();												//radio js
		ui_checkBox.init();											//checkbox js
		formControl.init();
		popupManger.init();
		ui_selectText.init();
		tooltip.init();												//tooltip
		tooltip02.init();												//tooltip2
		iframeLoad.init();											//iframe load

		// 상세보기 버튼 클릭시
		$(document).on('click', '.ui_detail_view', function(e){
			// 팝업 띄우기전 스크롤 위치 기억
			var popupCurrentScrollTop = $(window).scrollTop();
			var popupCurrentFocus = this;
			var popupCurrentPlayType = $(popupCurrentFocus).data("plan-type");

			// 컨테이너를 감추고 팝업을 띄운다
			$('.header, .container, .footer').hide();
			$('.pop_container').show();
			
			// 해당 컨텐츠를 노출한다
			$('[class^="coverage-detail-"]').hide();
			$(".coverage-detail-" + popupCurrentPlayType).show();
			
			$(window).scrollTop(0);
			setTimeout(function(){
				$('html,body').animate({scrollTop: 0}, 200);
			}, 500);

			setTimeout(function(){
		//		$('.pop_container .pop_head').attr({role: 'text', tabindex: 0}).focus();
				$('.pop_container .pop_head').attr({role: 'text'}).focus();
				
			}, 100);

			// 닫기 액션
			$('.pop_container .btn_close').on('click', function(e){
				e.preventDefault();

				$('.pop_container .btn_close').off('click');

				// 팝업 감추고 컨테이너를 띄우고 스크롤 위치 재자리
				$('.header, .container, .footer').show();
				$('.pop_container').hide();
				$(window).scrollTop(popupCurrentScrollTop);
				popupCurrentFocus.focus();
			});
		});
	});

}(jQuery))