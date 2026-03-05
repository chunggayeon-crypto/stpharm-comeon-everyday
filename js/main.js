/* ============================================
   main.js - 메인 기능 스크립트
   네비게이션, 스크롤 애니메이션, 모달, 공유 기능
   ============================================ */

// ===== 네비게이션 =====
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');

    // 스크롤 시 네비게이션 스타일 변경
    window.addEventListener('scroll', function () {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        // 맨 위로 버튼 표시/숨김
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    });

    // 모바일 메뉴 토글
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // 메뉴 링크 클릭 시 모바일 메뉴 닫기
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 맨 위로 버튼
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 스크롤 애니메이션 (Intersection Observer) =====
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 카드 딜레이 효과
                const cards = entry.target.parentElement;
                if (cards) {
                    const siblings = cards.querySelectorAll('.fade-up');
                    siblings.forEach(function (sibling, index) {
                        sibling.style.transitionDelay = (index * 0.1) + 's';
                    });
                }
            }
        });
    }, observerOptions);

    // 모든 fade-up 요소 관찰
    document.querySelectorAll('.fade-up').forEach(function (el) {
        observer.observe(el);
    });

    // ===== 탭 기능 (참여하기 페이지) =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');

                // 모든 탭 비활성화
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });

                // 선택된 탭 활성화
                this.classList.add('active');
                const tabContent = document.getElementById('tab-' + targetTab);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // ===== 콘텐츠 편집 시스템 (관리자용 인라인 편집) =====
    initEditableContent();
});

// ===== 모달 제어 =====
function openModal(type) {
    const modal = document.getElementById('modal-' + type);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById('modal-' + type);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== 토스트 알림 =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast ' + type;

    // 표시
    setTimeout(function () { toast.classList.add('show'); }, 10);

    // 3초 후 숨김
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

// ===== 공유 기능 =====
function shareEmail() {
    const subject = encodeURIComponent('에스티팜 Come on Everyday! 활동 공유');
    const body = encodeURIComponent('에스티팜의 고객중심 마인드 활동을 확인해 보세요!\n\n' + window.location.href);
    window.open('mailto:?subject=' + subject + '&body=' + body);
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(function () {
        showToast('링크가 복사되었습니다! 📋');
    }).catch(function () {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('링크가 복사되었습니다! 📋');
    });
}

// ===== 편집 가능한 콘텐츠 시스템 =====
const ContentManager = {
    STORAGE_KEY: 'comeon-content',

    // 저장된 콘텐츠 로드
    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    },

    // 콘텐츠 저장
    save(key, value) {
        const all = this.load();
        all[key] = value;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    },

    // 특정 콘텐츠 가져오기
    get(key) {
        const all = this.load();
        return all[key] || null;
    },

    // 전체 콘텐츠 설정
    saveAll(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};

// 편집 가능한 콘텐츠 초기화 (저장된 값 적용)
function initEditableContent() {
    const content = ContentManager.load();

    // 저장된 콘텐츠를 해당 요소에 적용
    Object.keys(content).forEach(function (key) {
        const el = document.getElementById(key);
        if (el && content[key]) {
            el.innerHTML = content[key];
        }
    });
}

// ===== 파일 업로드 미리보기 =====
document.addEventListener('change', function (e) {
    if (e.target.type === 'file' && e.target.files[0]) {
        const file = e.target.files[0];
        const uploadDiv = e.target.previousElementSibling;

        if (uploadDiv && uploadDiv.classList.contains('file-upload')) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                uploadDiv.innerHTML = `
          <img src="${ev.target.result}" alt="미리보기" style="max-height:150px; border-radius:8px; margin-bottom:0.5rem;">
          <p style="color: var(--accent-mint); font-weight: 600;">${file.name}</p>
          <p style="font-size: 0.75rem; color: var(--text-light);">클릭하여 다른 이미지로 변경</p>
        `;
            };
            reader.readAsDataURL(file);
        }
    }
});
