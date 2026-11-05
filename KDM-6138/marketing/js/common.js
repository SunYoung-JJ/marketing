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
