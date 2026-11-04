$(function () {
    //input clear btn (함수가 정의된 경우에만 실행)
    if (typeof textIputClear === "function") {
        textIputClear(".text-input");
        //textIputClear('.search-input');
    }

    //modal 열기 : data-popup-btn="팝업ID"
    $(document).on("click", "[data-popup-btn]", function (e) {
        e.preventDefault();
        modalOpen($(this).attr("data-popup-btn"));
    });

    //modal 닫기 : data-popup-close="팝업ID"
    $(document).on("click", "[data-popup-close]", function (e) {
        e.preventDefault();
        modalClose($(this).attr("data-popup-close"));
    });

    //modal 닫기 : 닫기(X) 버튼
    $(document).on("click", ".btn-pop-close", function (e) {
        e.preventDefault();
        modalClose($(this).closest(".modal-wrap").attr("id"));
    });

    //modal 닫기 : ESC 키
    $(document).on("keydown", function (e) {
        if (e.keyCode === 27) {
            var $last = $(".modal-wrap.on").last();
            if ($last.length) {
                modalClose($last.attr("id"));
            }
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

//modal
function modalOpen(popId) {
    var $pop = $("#" + popId);
    if (!$pop.length) {
        return;
    }
    $pop.addClass("on").attr({ role: "dialog", "aria-modal": "true", tabindex: "-1" });
    setTimeout(function () {
        $pop.children('[class^="modal-"]').addClass("on");
        $pop.focus();
    }, 100);
    $("body").css("overflow", "hidden");
}

function modalClose(popId) {
    var $pop = $("#" + popId);
    if (!$pop.length) {
        return;
    }
    $pop.removeClass("on");
    $pop.children('[class^="modal-"]').removeClass("on");
    //열었던 버튼으로 포커스 복귀
    $('[data-popup-btn="' + popId + '"]').first().focus();
    //열려있는 다른 모달이 없을 때만 스크롤 복구
    if (!$(".modal-wrap.on").length) {
        $("body").css("overflow", "");
    }
}
