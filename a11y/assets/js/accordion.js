function AccordionScript() {
    const _$this = this;
    let accordionGroups;
    
    _$this.init = {
        // 여러 개의 accordion 을 각각 독립적으로 이벤트 실행
        getAccordionGroups: () => {
            // 현재 페이지에 있는 모든 accordion 을 배열로 담음
            accordionGroups = document.querySelectorAll('[data-role="accordion-group"]');
            accordionGroups.forEach(function(accordionGroup) {
                _$this.init.getAccordionBtns(accordionGroup);
            });
        },
        // accordion 버튼 클릭 이벤트를 독립적으로 실행
        getAccordionBtns: (accordionGroup) => {
            // 배열에 담긴 accordion 내부 버튼을 찾아서
            const accordionBtns = accordionGroup.querySelectorAll('.accordion-btn');
            accordionBtns.forEach(function(accordionBtn) {
                // 클릭 이벤트를 실행
                _$this.clickAction.accordionBtnClick(accordionBtn);
                accordionBtn.nextElementSibling.style.transitionDuration = accordionBtn.nextElementSibling.scrollHeight * 0.0016 + 's';
                // 초기 셋팅 : button 의 aria-expanded 값이 false 인 accordion contents 에 hidden 값 넣기
                if (accordionBtn.ariaExpanded === 'false' && accordionBtn.nextElementSibling !== null) accordionBtn.nextElementSibling.setAttribute('hidden', 'true');
                // 초기 셋팅 : button 의 aria-expanded 값이 true 인 accordion contents 에 height size 넣기
                if (accordionBtn.ariaExpanded === 'true' && accordionBtn.nextElementSibling !== null) accordionBtn.nextElementSibling.style.height = accordionBtn.nextElementSibling.scrollHeight + 'px';
            });
        },
    };
    _$this.accordionEvent = {
        removeEvent: (target, accordionGroup) => {
            const accordionBtns = accordionGroup.querySelectorAll('.accordion-btn');
            const accordionContents = accordionGroup.querySelectorAll('[role="region"]');
            for (let accordionBtn of accordionBtns) {
                // 기존에 선택 된 accordion 속성 false 로 만들기
                if (accordionBtn.ariaExpanded === 'true') {
                    accordionBtn.setAttribute('aria-expanded', 'false');
                    if (accordionBtn.nextElementSibling !== null) {
                        accordionBtn.nextElementSibling.style.height = 0;
                        accordionBtn.nextElementSibling.addEventListener('transitionend', _$this.accordionEvent.accordionTransitionend);
                    };
                };
            };
        },
        accordionTransitionend: () => {
            const accordionContentsAll = document.querySelectorAll('.wrap-accordion-contents');
            accordionContentsAll.forEach((accordionContent) => {
                if (accordionContent.previousElementSibling.ariaExpanded === 'false') {
                    accordionContent.setAttribute('hidden', 'true');
                } else if (accordionContent.previousElementSibling.ariaExpanded === 'true') {
                    accordionContent.removeAttribute('hidden');
                };
            });

        },
    },
    _$this.heightSizeTransiton = {
        activeEvent: (target, targetContents) => {
            target.setAttribute('aria-expanded', 'true');
            targetContents.removeAttribute('hidden');
            targetContents.style.height = targetContents.scrollHeight + 'px';
        },
        removeEvent: (target, targetContents) => {
            target.setAttribute('aria-expanded', 'false');
            targetContents.style.height = 0;
            targetContents.addEventListener('transitionend', _$this.accordionEvent.accordionTransitionend);
        },
    };
    _$this.clickEvent = {
        accordionBtnclickEvent: (e) => {
            let target = e.target.tagName;
            target === 'BUTTON' ? target = e.target : target = e.target.closest('button');
            const accordionOption = target.closest('[accordion-option]').getAttribute('accordion-option');
            const accordionGroup = target.closest('[data-role="accordion-group"]');
            const targetContents = accordionGroup.querySelector(`[aria-labelledby="${target.id}"]`);
            // 연결된 accordion은 무조건 하나씩 만 열리는 type
            if (accordionOption === 'only') {
                if (target.ariaExpanded === 'false') {
                    // 미선택된 accordion 속성 false 상태로 만들기
                    _$this.accordionEvent.removeEvent(target, accordionGroup);
                    // 선택 된 accordion 속성 true 상태로 만들기
                    _$this.heightSizeTransiton.activeEvent(target, targetContents);
                } else if (target.ariaExpanded === 'true') {
                    _$this.heightSizeTransiton.removeEvent(target, targetContents);
                };
            // toggle type (default)
            } else {
                if (target.ariaExpanded === 'false') {
                    _$this.heightSizeTransiton.activeEvent(target, targetContents);
                } else if (target.ariaExpanded === 'true') {
                    _$this.heightSizeTransiton.removeEvent(target, targetContents);
                };
            };
        },
    };
    _$this.clickAction = {
        accordionBtnClick: (accordionBtn) => {
            // 클릭 이벤트
            accordionBtn.addEventListener('click', _$this.clickEvent.accordionBtnclickEvent);
        },
    };
    return {
        init: () => {
            _$this.init.getAccordionGroups();
        }
    };
};
var accordionScript = new AccordionScript();
window.addEventListener('load', function() {
    accordionScript.init();
});