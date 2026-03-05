/* ============================================
   admin.js - 관리자 대시보드 기능
   로그인 인증, 게시글 관리, 콘텐츠 편집, 디자인 설정
   ============================================ */

// ===== 관리자 인증 시스템 =====
// 관리자 계정 정보 (ID: admin, PW: stp1234)
var ADMIN_CREDENTIALS = { id: 'admin', pw: 'stp1234' };

// 로그인 처리
function handleLogin(e) {
    e.preventDefault();
    var inputId = document.getElementById('loginId').value;
    var inputPw = document.getElementById('loginPw').value;
    var errorEl = document.getElementById('loginError');

    if (inputId === ADMIN_CREDENTIALS.id && inputPw === ADMIN_CREDENTIALS.pw) {
        // 로그인 성공 - 세션에 저장 (탭을 닫으면 자동 로그아웃)
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginOverlay').classList.add('hidden');
        if (errorEl) errorEl.style.display = 'none';
        loadDashboard();
    } else {
        // 로그인 실패
        if (errorEl) errorEl.style.display = 'block';
        document.getElementById('loginPw').value = '';
        document.getElementById('loginPw').focus();
    }
}

// 로그아웃 처리
function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        document.getElementById('loginOverlay').classList.remove('hidden');
        document.getElementById('loginId').value = '';
        document.getElementById('loginPw').value = '';
    }
}

// 인증 상태 확인
function checkAuth() {
    var overlay = document.getElementById('loginOverlay');
    if (!overlay) return;

    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        overlay.classList.add('hidden');
    } else {
        overlay.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // ===== 인증 체크 (가장 먼저 실행) =====
    checkAuth();

    // ===== 사이드바 네비게이션 =====
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // 사이드바 활성화
            sidebarLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');

            // 섹션 표시
            document.querySelectorAll('.admin-section').forEach(function (s) {
                s.style.display = 'none';
            });
            const targetSection = document.getElementById('section-' + section);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // 해당 섹션 데이터 로드
            if (section === 'dashboard') loadDashboard();
            if (section === 'posts') loadPostsTable('paparazzi');
            if (section === 'content') loadContentEditor();
            if (section === 'design') loadDesignSettings();

            // 모바일 사이드바 닫기
            const sidebar = document.getElementById('adminSidebar');
            if (sidebar) sidebar.classList.remove('active');
        });
    });

    // 사이드바 토글 (모바일)
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            const sidebar = document.getElementById('adminSidebar');
            if (sidebar) sidebar.classList.toggle('active');
        });
    }

    // ===== 게시글 관리 탭 =====
    const postTabs = document.querySelectorAll('.admin-tab-btn[data-post-tab]');
    postTabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            postTabs.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            loadPostsTable(this.getAttribute('data-post-tab'));
        });
    });

    // ===== 색상 입력 동기화 =====
    const colorPairs = ['bgPrimary', 'bgSecondary', 'accentMint', 'accentMintLight', 'textPrimary', 'textSecondary'];
    colorPairs.forEach(function (name) {
        const colorInput = document.getElementById('theme-' + name);
        const textInput = document.getElementById('theme-' + name + '-text');

        if (colorInput && textInput) {
            colorInput.addEventListener('input', function () {
                textInput.value = this.value.toUpperCase();
            });
            textInput.addEventListener('input', function () {
                if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
                    colorInput.value = this.value;
                }
            });
        }
    });

    // 초기 대시보드 로드
    loadDashboard();
});

// ===== 대시보드 로드 =====
function loadDashboard() {
    const stats = PostsManager.getStats();

    // 통계 업데이트
    const statTotal = document.getElementById('statTotal');
    const statPaparazzi = document.getElementById('statPaparazzi');
    const statPoster = document.getElementById('statPoster');
    const statSticker = document.getElementById('statSticker');
    const statOneword = document.getElementById('statOneword');

    if (statTotal) statTotal.textContent = stats.total;
    if (statPaparazzi) statPaparazzi.textContent = stats.paparazzi;
    if (statPoster) statPoster.textContent = stats.poster;
    if (statSticker) statSticker.textContent = stats.sticker;
    if (statOneword) statOneword.textContent = stats.oneword;

    // 최근 활동
    const recentPosts = PostsManager.getRecent(8);
    const activityList = document.getElementById('recentActivity');
    if (activityList) {
        const categoryNames = {
            paparazzi: '📸 파파라치',
            poster: '🎨 포스터',
            sticker: '⭐ 스티커',
            oneword: '💬 한마디'
        };

        if (recentPosts.length === 0) {
            activityList.innerHTML = '<li style="text-align: center; color: var(--text-light); padding: 2rem;">등록된 활동이 없습니다.</li>';
        } else {
            activityList.innerHTML = recentPosts.map(function (post) {
                return '<li>' +
                    '<div class="activity-icon">' + (post.emoji || '📝') + '</div>' +
                    '<div class="activity-text">' +
                    '<strong>' + post.title + '</strong><br>' +
                    '<span style="font-size: 0.8rem; color: var(--text-secondary);">' +
                    (categoryNames[post.category] || '') + ' · ' + post.author +
                    '</span>' +
                    '</div>' +
                    '<span class="activity-time">' + post.date + '</span>' +
                    '</li>';
            }).join('');
        }
    }
}

// ===== 게시글 테이블 로드 =====
function loadPostsTable(category) {
    const posts = PostsManager.getByCategory(category);
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    const tagClassMap = {
        '적극적 소통': 'tag-mint',
        '유연성': 'tag-blue',
        '긴박감': 'tag-red'
    };

    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-light);">등록된 게시글이 없습니다.</td></tr>';
        return;
    }

    tbody.innerHTML = posts.map(function (post) {
        const tagClass = tagClassMap[post.tag] || 'tag-mint';
        return '<tr>' +
            '<td><strong>' + post.title + '</strong></td>' +
            '<td>' + post.author + '</td>' +
            '<td><span class="tag ' + tagClass + '">' + (post.tag || '-') + '</span></td>' +
            '<td>' + post.date + '</td>' +
            '<td class="actions">' +
            '<button class="btn-delete" title="삭제" onclick="deletePost(\'' + category + '\', \'' + post.id + '\')">' +
            '<i class="fas fa-trash"></i>' +
            '</button>' +
            '</td>' +
            '</tr>';
    }).join('');
}

// ===== 게시글 삭제 =====
function deletePost(category, postId) {
    if (confirm('이 게시글을 삭제하시겠습니까?')) {
        PostsManager.delete(category, postId);
        loadPostsTable(category);
        loadDashboard();
        showToast('게시글이 삭제되었습니다.', 'success');
    }
}

// ===== 샘플 데이터 복원 =====
function resetPostsData() {
    if (confirm('모든 게시글을 샘플 데이터로 복원하시겠습니까?\n기존에 추가한 게시글은 모두 삭제됩니다.')) {
        PostsManager.resetToSample();
        // 현재 활성 탭 새로고침
        const activeTab = document.querySelector('.admin-tab-btn.active[data-post-tab]');
        if (activeTab) {
            loadPostsTable(activeTab.getAttribute('data-post-tab'));
        }
        loadDashboard();
        showToast('샘플 데이터로 복원되었습니다! ✨', 'success');
    }
}

// ===== 콘텐츠 에디터 로드 =====
function loadContentEditor() {
    const content = ContentManager.load();

    // 저장된 값이 있으면 폼에 반영
    const fields = [
        'heroTitle', 'heroSubtitle', 'introTitle', 'introDesc',
        'mindsetDesc1', 'mindsetDesc2', 'mindsetDesc3'
    ];

    fields.forEach(function (field) {
        const el = document.getElementById('edit-' + field);
        if (el && content[field]) {
            el.value = content[field];
        }
    });
}

// ===== 콘텐츠 저장 =====
function saveContent(page) {
    const content = ContentManager.load();

    if (page === 'main') {
        content.heroTitle = document.getElementById('edit-heroTitle').value;
        content.heroSubtitle = document.getElementById('edit-heroSubtitle').value;
        content.introTitle = document.getElementById('edit-introTitle').value;
        content.introDesc = document.getElementById('edit-introDesc').value;
    }

    if (page === 'mindset') {
        content.mindsetDesc1 = document.getElementById('edit-mindsetDesc1').value;
        content.mindsetDesc2 = document.getElementById('edit-mindsetDesc2').value;
        content.mindsetDesc3 = document.getElementById('edit-mindsetDesc3').value;
    }

    ContentManager.saveAll(content);
    showToast('콘텐츠가 저장되었습니다! ✅', 'success');
}

// ===== 디자인 설정 로드 =====
function loadDesignSettings() {
    const theme = ThemeManager.getCurrent();
    const fields = ['bgPrimary', 'bgSecondary', 'accentMint', 'accentMintLight', 'textPrimary', 'textSecondary'];

    fields.forEach(function (field) {
        const colorInput = document.getElementById('theme-' + field);
        const textInput = document.getElementById('theme-' + field + '-text');
        if (colorInput && theme[field]) colorInput.value = theme[field];
        if (textInput && theme[field]) textInput.value = theme[field];
    });

    const fontSelect = document.getElementById('theme-fontFamily');
    if (fontSelect && theme.fontFamily) {
        fontSelect.value = theme.fontFamily;
    }
}

// ===== 디자인 미리보기 =====
function previewDesign() {
    const theme = getDesignFormValues();
    ThemeManager.apply(theme);
    showToast('미리보기가 적용되었습니다. 저장하려면 "디자인 저장"을 클릭하세요.', 'success');
}

// ===== 디자인 저장 =====
function saveDesign() {
    const theme = getDesignFormValues();
    ThemeManager.save(theme);
    showToast('디자인 설정이 저장되었습니다! 🎨', 'success');
}

// ===== 디자인 폼 값 가져오기 =====
function getDesignFormValues() {
    return {
        bgPrimary: document.getElementById('theme-bgPrimary').value,
        bgSecondary: document.getElementById('theme-bgSecondary').value,
        accentMint: document.getElementById('theme-accentMint').value,
        accentMintLight: document.getElementById('theme-accentMintLight').value,
        accentMintDark: ThemeManager.defaults.accentMintDark,
        textPrimary: document.getElementById('theme-textPrimary').value,
        textSecondary: document.getElementById('theme-textSecondary').value,
        fontFamily: document.getElementById('theme-fontFamily').value
    };
}

// ===== 디자인 리셋 =====
function resetDesign() {
    if (confirm('디자인 설정을 기본값으로 복원하시겠습니까?')) {
        ThemeManager.reset();
        loadDesignSettings();
        showToast('디자인이 기본값으로 복원되었습니다! 🔄', 'success');
    }
}
