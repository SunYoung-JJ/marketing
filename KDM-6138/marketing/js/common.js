$(function () {
    //input clear btn (함수가 정의된 경우에만 실행)
    if (typeof textIputClear === "function") {
        textIputClear(".text-input");
        //textIputClear('.search-input');
    }

    //modal 열기 : data-popup-btn="팝업ID"
    $(document).on("click", "[data-popup-btn]", function (e) {
        e.preventDefault();
        modal($(this).attr("data-popup-btn"), true);
    });

    //modal 닫기 : data-popup-close="팝업ID"
    $(document).on("click", "[data-popup-close]", function (e) {
        e.preventDefault();
        modal($(this).attr("data-popup-close"), false);
    });

    //modal 닫기 : 닫기(X) 버튼
    $(document).on("click", ".btn-pop-close", function (e) {
        e.preventDefault();
        modal($(this).closest(".modal-wrap").attr("id"), false);
    });

    //modal 닫기 : ESC 키
    $(document).on("keydown", function (e) {
        if (e.keyCode === 27) {
            var $last = $(".modal-wrap.on, .form-panel.on").last();
            if ($last.length) {
                modal($last.attr("id"), false);
            }
        }
    });

    //모바일 메뉴(#gnbSub), 상담신청 바텀시트(#formPanel) 닫기 : 어두운 배경 클릭
    $(document).on("click", "#gnbSub, #formPanel", function (e) {
        if (e.target === this && $(this).hasClass("on")) {
            modal(this.id, false);
        }
    });

    //tab : 탭 버튼(.tab-item) 클릭 → aria-controls 에 적힌 패널 보여주기
    // - .tab-list, .tab-list.tab-type02(안쪽 탭) 모두 동작
    $(".tab-item").on("click", function () {
        var $this = $(this);
        var $panel = $("#" + $this.attr("aria-controls"));

        //1. 클릭한 탭만 on (선택 탭만 Tab 키로 들어올 수 있게 tabindex 0, 나머지 -1)
        $this.addClass("on").attr({ "aria-selected": "true", tabindex: "0" })
            .siblings(".tab-item").removeClass("on").attr({ "aria-selected": "false", tabindex: "-1" });

        //2. 같은 그룹의 패널만 숨기고, 연결된 패널 보이기 (바깥 탭 패널은 그대로)
        $panel.siblings(".tab-panel").removeClass("on").attr("hidden", "hidden");
        $panel.addClass("on").removeAttr("hidden");

        //3. 가로 스크롤 탭(tab-type02) : 클릭한 탭이 가운데 오도록 스크롤
        var $inner = $this.parent(".tab-list-inner");
        $inner.stop().animate({
            scrollLeft: $inner.scrollLeft() + $this.position().left - ($inner.width() - $this.outerWidth()) / 2
        }, 200);
    });

    //tab : 처음 열릴 때 .on 탭의 패널 보이기
    $(".tab-item.on").trigger("click");

    //tab-type03 (보험료예시 성별 탭) : 버튼 클릭 → aria-controls 에 적힌 .tab-panel 보이기
    $(".tab-type03 [role='tab']").on("click", function () {
        var $this = $(this);
        var $panel = $("#" + $this.attr("aria-controls"));

        //1. 클릭한 탭만 선택 (선택 탭만 tabindex 0)
        $this.addClass("on").attr({ "aria-selected": "true", tabindex: "0" })
            .siblings("[role='tab']").removeClass("on").attr({ "aria-selected": "false", tabindex: "-1" });

        //2. 같은 그룹의 성별 패널만 숨기고, 연결된 패널 보이기
        $panel.siblings(".tab-panel").removeClass("on").attr("hidden", "hidden");
        $panel.addClass("on").removeAttr("hidden");
    });

    //tab-type03 : 처음 열릴 때 aria-selected="true" 인 첫 탭의 패널 보이기
    $(".tab-type03").each(function () {
        var $tabs = $(this).find("[role='tab']");
        var $first = $tabs.filter("[aria-selected='true']").first();
        ($first.length ? $first : $tabs.first()).trigger("click");
    });

    //tab 키보드 : 탭 목록(role="tablist") 안에서 ←/→ 이전·다음 탭, Home/End 처음·마지막 탭으로 이동 + 선택
    $("[role='tablist']").on("keydown", "[role='tab']", function (e) {
        var $tabs = $(e.delegateTarget).find("[role='tab']");
        var idx = $tabs.index(this);
        var next;

        switch (e.which) {
            case 37: next = (idx - 1 + $tabs.length) % $tabs.length; break; //←
            case 39: next = (idx + 1) % $tabs.length; break;                 //→
            case 36: next = 0; break;                                        //Home
            case 35: next = $tabs.length - 1; break;                         //End
            default: return;
        }
        e.preventDefault();
        $tabs.eq(next).trigger("click").focus();
    });

    //상담신청 폼 : 제출 버튼(type="submit", form="consultForm") → 페이지 이동 막기 (개발 연동 전)
    $(".js-form").on("submit", function (e) {
        e.preventDefault();
    });

    //tab-age (보험료예시 나이 버튼, mo 전용) : 선택한 나이를 .pannel-detail[data-age] 에 넣음 → css 가 해당 나이 열만 보여줌
    $(".tab-age button").on("click", function () {
        var $this = $(this);

        $this.attr("aria-pressed", "true")
            .siblings("button").attr("aria-pressed", "false");
        $this.closest(".pannel-detail").attr("data-age", $this.attr("data-age"));
    });

    //tab-age : 처음 열릴 때 aria-pressed="true" 인 나이 적용
    $(".tab-age").each(function () {
        var $btns = $(this).find("button");
        var $first = $btns.filter("[aria-pressed='true']").first();
        ($first.length ? $first : $btns.first()).trigger("click");
    });

    //products-item-banner (상품특징 카드) : mo(768px 이하)에서만 Swiper 슬라이드, PC 는 해제
    // - 감싸는 .product-img-item 이 swiper-container, ul 이 swiper-wrapper, li 가 swiper-slide
    (function () {
        var $banner = $(".products-item-banner");
        var bannerSwipers = [];

        if (!$banner.length || typeof Swiper !== "function") {
            return;
        }

        function bannerOn() {
            $banner.each(function () {
                var $ul = $(this);
                var $box = $ul.parent();

                $box.addClass("swiper-container");
                $ul.addClass("swiper-wrapper").children("li").addClass("swiper-slide");

                bannerSwipers.push(new Swiper($box[0], {
                    slidesPerView: 1.6,        //카드 1.6장 보이게 (다음 카드가 살짝 보임) : 폭은 Swiper 가 계산
                    spaceBetween: 12,
                    slidesOffsetBefore: 16,
                    slidesOffsetAfter: 16,
                    watchOverflow: true,
                    observer: true,            //숨겨진 탭 패널이 열릴 때 크기 다시 계산
                    observeParents: true
                }));
            });
        }

        function bannerOff() {
            $.each(bannerSwipers, function (i, swiper) {
                swiper.destroy(true, true);
            });
            bannerSwipers = [];
            $banner.removeClass("swiper-wrapper").children("li").removeClass("swiper-slide");
            $banner.parent().removeClass("swiper-container");
        }

        function bannerCheck() {
            var isMo = window.matchMedia("(max-width:768px)").matches;

            if (isMo && !bannerSwipers.length) {
                bannerOn();
            } else if (!isMo && bannerSwipers.length) {
                bannerOff();
            }
        }

        bannerCheck();
        $(window).on("resize", bannerCheck);
    })();

    //상단 메인 탭(.main-tabs) : 링크 href 의 패널(.main-panel) 보이기
    $(".main-tabs a").on("click", function (e) {
        e.preventDefault();
        var targetId = $(this).attr("href");

        $(this).parent("li").addClass("active").siblings().removeClass("active");
        $(".main-panel").removeClass("active");
        $(targetId).addClass("active");
    });

    //중단 서브 탭(.sub-tabs) : 링크 href 의 패널(.sub-panel) 보이기
    $(".sub-tabs a").on("click", function (e) {
        e.preventDefault();
        var subTargetId = $(this).attr("href");

        $(this).parent("li").addClass("active").siblings().removeClass("active");
        $(".sub-panel").removeClass("active");
        $(subTargetId).addClass("active");
    });

    //성별/연령 토글(.segment-control) (updatePreviewData 가 정의된 경우에만 실행)
    $(".segment-control a").on("click", function (e) {
        e.preventDefault();
        $(this).parent("li").addClass("active").siblings().removeClass("active");
        if (typeof updatePreviewData === "function") {
            updatePreviewData();
        }
    });

    //input focus
    $(".text-input > input").on("focus", function () {
        $(this).parents(".input-area").addClass("focus");
    });
    $(".text-input > input").on("focusout", function () {
        $(this).parents(".input-area").removeClass("focus");
    });
});

//modal : modal("팝업ID", true) 열기, modal("팝업ID", false) 닫기
function modal(popId, isOpen) {
    var $pop = $("#" + popId);
    if (!$pop.length) {
        return;
    }
    if (isOpen) {
        $pop.addClass("on").attr({ role: "dialog", "aria-modal": "true", tabindex: "-1" });
        setTimeout(function () {
            $pop.children('[class^="modal-"]').addClass("on");
            $pop.focus();
        }, 100);
        $("body").css("overflow", "hidden");
    } else {
        $pop.removeClass("on");
        $pop.children('[class^="modal-"]').removeClass("on");
        //열었던 버튼으로 포커스 복귀
        $('[data-popup-btn="' + popId + '"]').first().focus();
        //열려있는 다른 모달이 없을 때만 스크롤 복구
        if (!$(".modal-wrap.on").length) {
            $("body").css("overflow", "");
        }
    }
}

//공통 include : <div data-include="/marketing/KDM-6138/marketing/includes/footer.jsp"></div>
// - Tomcat 에서는 JSP 실행 결과를, GitHub Pages 에서는 파일 원본을 받아 <% %> 태그를 지우고 넣음
(function ($) {
    $(function () {
        $("[data-include]").each(function () {
            var $el = $(this);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", $el.attr("data-include"), true);
            xhr.overrideMimeType("text/html; charset=utf-8");
            xhr.onload = function () {
                if (xhr.status < 200 || xhr.status >= 300) return;
                $el.html(xhr.responseText.replace(/<%[\s\S]*?%>/g, ""));
            };
            xhr.send();
        });
    });
})(jQuery);
