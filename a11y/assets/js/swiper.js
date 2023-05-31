window.addEventListener("load", function () {
  let thisSlide,
  autoPlayBtn,
  autoPlayState;
new Swiper('.swiper-container', {
slidesPerView: 1,
autoplay: {
  delay: 1000,
},
navigation: {
  nextEl: '.wrap-slide-box .swiper-button-next',
  prevEl: '.wrap-slide-box .swiper-button-prev',
},
pagination: {
  el: ".swiper-pagination",
},
a11y: {
  prevSlideMessage: '이전 슬라이드',
  nextSlideMessage: '다음 슬라이드',
  slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
},
on: {
  init: function () {
    thisSlide = this;
    autoPlayBtn = document.querySelector('.wrap-autoplay-control > button');
    autoPlayBtn.addEventListener('click', (e) => {
      autoPlayState = autoPlayBtn.getAttribute('aria-pressed');
      if (autoPlayState === 'false') {
        autoPlayBtn.setAttribute('aria-pressed', 'true');
        thisSlide.autoplay.stop();
      } else if (autoPlayState === 'true') {
        autoPlayBtn.setAttribute('aria-pressed', 'false');
        thisSlide.autoplay.start();
      };
    });
  },
},
});
});

window.addEventListener("load", function(){
  let thisSlide, // Swiper Slide
    focusOut, // 슬라이드 키보드 접근 확인
    slideFocus = {}, // 슬라이드 내부 탭 포커스 가능한 요소 저장
    swiperWrapper = document.querySelector('.swiper-wrapper'),
    slideAll, // 전체 슬라이드 저장
    slideLength, // 슬라이드 갯수
    onClickNavigation, // 슬라이드 이전/다음 버튼으로 슬라이드 전환 확인
    navigations = {}, // 슬라이드 이전 다음 버튼
    prevEnter; // 이전 버튼 키보드 엔터로 접근 확인
const slideKeyDownEvt = (e, idx) => {
  // back tab : 첫 번째 슬라이드 포커스 시
  if (e.key == 'Tab' && e.shiftKey && thisSlide.activeIndex === 0) {
    focusOut = false;
    // back tab : 그 외 슬라이드 포커스 시
  } else if (e.key == 'Tab' && e.shiftKey && e.target === slideFocus[idx][0]) {
    e.preventDefault();
    focusOut = true;
    slideAll[thisSlide.activeIndex - 1].setAttribute('tabindex', '0');
    thisSlide.slideTo(thisSlide.activeIndex - 1);
    removeSlideTabindex();
  } else if (e.key == 'Tab' && !e.shiftKey && e.target === slideFocus[idx][slideFocus[idx].length - 1]) {
    if (idx >= slideLength) {
      // tab : 마지막 슬라이드 내 마지막 요소 포커스 시
      focusOut = false;
    } else {
      // tab : 그 외 슬라이드 내 마지막 요소 포커스 시
      e.preventDefault();
      if (slideAll[thisSlide.activeIndex + 1] <= slideLength) slideAll[thisSlide.activeIndex + 1].setAttribute('tabindex', '0');
      focusOut = true;
      thisSlide.slideTo(thisSlide.activeIndex + 1);
      removeSlideTabindex();
    }
  };
};
// 슬라이드 내부 클릭 요소 tabindex 값 삭제
const removeSlideTabindex = () => {
  slideAll.forEach((element, i) => {
    let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
    focusTarget.forEach((el, idx) => {
      if (el.closest('.swiper-slide') === slideAll[thisSlide.activeIndex]) el.removeAttribute('tabindex');
    });
  });
};
const slideFocusAct = (e, idx, next) => {
  if (onClickNavigation && e.key == 'Tab' && next) {
    slideFocus[idx][0].setAttribute('tabindex', '0');
    slideFocus[idx][0].focus();
    removeSlideTabindex();
    onClickNavigation = false;
  } else if (onClickNavigation && !next) {
    if (e.key == 'Enter') prevEnter = true;
    else if (e.key == 'Tab' && prevEnter) {
      if (idx === 0) idx = 1;
      else idx = idx;
      slideFocus[idx - 1][0].setAttribute('tabindex', '0');
      slideFocus[idx - 1][0].focus();
      removeSlideTabindex();
      onClickNavigation = false;
      prevEnter = false;
    }
  }
};
new Swiper('.swiper-container', {
  slidesPerView: 1,
  speed: 700,
  navigation: {
    nextEl: '.wrap-slide-box .swiper-button-next',
    prevEl: '.wrap-slide-box .swiper-button-prev',
  },
  pagination: {
    el: ".swiper-pagination",
  },
  a11y: {
    prevSlideMessage: '이전 슬라이드',
    nextSlideMessage: '다음 슬라이드',
    slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
  },
  on: {
    init: function() {
      thisSlide = this;
      slideAll = document.querySelectorAll('.swiper-slide');
      slideLength = slideAll.length - 1;
      navigations['prev'] = document.querySelector('.swiper-button-prev');
      navigations['next'] = document.querySelector('.swiper-button-next');
      slideAll.forEach((element, idx) => {
        slideAll[thisSlide.activeIndex].setAttribute('tabindex', '0');
        let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
        focusTarget.forEach((el, i) => {
          if (el.closest('.swiper-slide') !== slideAll[thisSlide.activeIndex]) {
            el.setAttribute('tabindex', '-1');
          };
        });
        slideFocus[idx] = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]')); 
        slideFocus[idx].unshift(element);
        slideFocus[idx][0].addEventListener('keydown', (e) => slideKeyDownEvt(e, idx));
      });
      Object.values(navigations).forEach((navigation) => {
        navigation.addEventListener('keydown', () => {
          onClickNavigation = true;
        });
      })
      navigations['next'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, true));
      navigations['prev'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, false));
    },
    touchMove: function() {
      return onClickNavigation = false;
    },
    slideNextTransitionEnd: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][0].focus();
        focusOut = false;
      };
    },
    slidePrevTransitionStart: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][slideFocus[this.realIndex].length - 1].focus();
        focusOut = false;
      };
    },
  },
});
});

window.addEventListener("load", function(){
  let thisSlide, // Swiper Slide
    focusOut, // 슬라이드 키보드 접근 확인
    slideFocus = {}, // 슬라이드 내부 탭 포커스 가능한 요소 저장
    swiperWrapper = document.querySelector('.swiper-wrapper'),
    slideAll, // 전체 슬라이드 저장
    realSlideAll, // loop 모드 일때 복사 된 슬라이드를 제외한 실제 슬라이드 저장
    slideLength, // 슬라이드 갯수 - 1
    onClickNavigation, // 슬라이드 이전/다음 버튼으로 슬라이드 전환 확인
    navigations = {}, // 슬라이드 이전 다음 버튼
    prevEnter; // 이전 버튼 키보드 엔터로 접근 확인
const slideKeyDownEvt = (e, idx) => {
  // back tab : 첫 번째 슬라이드 포커스 시
  if (e.key == 'Tab' && e.shiftKey && thisSlide.realIndex === 0) {
    focusOut = false;
    // back tab : 그 외 슬라이드 포커스 시
  } else if (e.key == 'Tab' && e.shiftKey && e.target === slideFocus[idx][0]) {
    e.preventDefault();
    focusOut = true;
    realSlideAll[thisSlide.realIndex - 1].setAttribute('tabindex', '0');
    thisSlide.slideTo(thisSlide.activeIndex - 1);
    removeSlideTabindex();
  } else if (e.key == 'Tab' && !e.shiftKey && e.target === slideFocus[idx][slideFocus[idx].length - 1]) {
    if (idx >= slideLength) {
      // tab : 마지막 슬라이드 내 마지막 요소 포커스 시
      focusOut = false;
    } else {
      // tab : 그 외 슬라이드 내 마지막 요소 포커스 시
      e.preventDefault();
      if (realSlideAll[thisSlide.realIndex + 1] <= slideLength) realSlideAll[thisSlide.realIndex + 1].setAttribute('tabindex', '0');
      focusOut = true;
      thisSlide.slideTo(thisSlide.activeIndex + 1);
      removeSlideTabindex();
    };
  };
};
// 슬라이드 내부 클릭 요소 tabindex 값 삭제
const removeSlideTabindex = () => {
  slideAll.forEach((element, i) => {
    let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
    focusTarget.forEach((el, idx) => {
      if (el.closest('.swiper-slide') === slideAll[thisSlide.activeIndex]) el.removeAttribute('tabindex');
    });
  });
};
const slideFocusAct = (e, idx, next) => {
  if (onClickNavigation) {
    if (e.key == 'Enter' && !next) prevEnter = true;
    else if (e.key == 'Tab') {
      if (idx === 0) {
        idx = slideLength;
        thisSlide.slideTo(slideLength + 1, 0);
      } else if (idx === realSlideAll.length + 1) {
        idx = 0;
        thisSlide.slideTo(1, 0);
      } else {
        idx = idx - 1;
      }
      if ((!e.shiftKey && next) || (prevEnter && !next)) {
        e.preventDefault();
        slideFocus[idx][0].setAttribute('tabindex', '0');
        slideFocus[idx][0].focus();
        removeSlideTabindex();
        onClickNavigation = false;
        prevEnter = false;
      };
    };
  };
};
new Swiper('.swiper-container', {
  slidesPerView: 1,
  speed: 300,
  loop: true,
  navigation: {
    nextEl: '.wrap-slide-box .swiper-button-next',
    prevEl: '.wrap-slide-box .swiper-button-prev',
  },
  pagination: {
    el: ".swiper-pagination",
  },
  a11y: {
    prevSlideMessage: '이전 슬라이드',
    nextSlideMessage: '다음 슬라이드',
    slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
  },
  on: {
    init: function() {
      thisSlide = this;
      slideAll = document.querySelectorAll('.swiper-slide');
      realSlideAll = document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
      slideLength = realSlideAll.length - 1;
      navigations['prev'] = document.querySelector('.swiper-button-prev');
      navigations['next'] = document.querySelector('.swiper-button-next');
      slideAll.forEach((element, i) => {
        if (element.classList.contains('swiper-slide-duplicate')) {
          element.setAttribute('aria-hidden', 'true');
        }
        slideAll[thisSlide.activeIndex].setAttribute('tabindex', '0');
        let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
        focusTarget.forEach((el, idx) => {
          if (el.closest('.swiper-slide') !== slideAll[thisSlide.activeIndex]) {
            el.setAttribute('tabindex', '-1');
          };
        });
      });
      realSlideAll.forEach((element, idx) => {
        slideFocus[idx] = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]')); 
        slideFocus[idx].unshift(element);
        slideFocus[idx][0].removeEventListener('keydown', (e) => slideKeyDownEvt(e, idx));
        slideFocus[idx][0].addEventListener('keydown', (e) => slideKeyDownEvt(e, idx));
      });
      Object.values(navigations).forEach((navigation) => {
        navigation.addEventListener('keydown', () => {
          onClickNavigation = true;
        });
      });
      navigations['next'].removeEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, true));
      navigations['next'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, true));
      navigations['prev'].removeEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, false));
      navigations['prev'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, false));
    },
    touchMove: function() {
      return onClickNavigation = false;
    },
    slideNextTransitionEnd: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][0].focus();
        focusOut = false;
      };
    },
    slidePrevTransitionStart: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][slideFocus[this.realIndex].length - 1].focus();
        focusOut = false;
      };
    },
  },
});
})