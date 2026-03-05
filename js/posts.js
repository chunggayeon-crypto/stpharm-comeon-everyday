/* ============================================
   posts.js - 게시글 CRUD 관리 시스템
   localStorage 기반 데이터 영속성
   ============================================ */

const PostsManager = {

    // Storage 키
    STORAGE_KEY: 'comeon-posts',

    // ===== 샘플 데이터 =====
    sampleData: {
        paparazzi: [
            {
                id: 'p1',
                title: '영업팀 김대리의 빛나는 소통 순간',
                author: '박소연 / 마케팅팀',
                date: '2026-03-01',
                tag: '적극적 소통',
                content: '오늘 회의 중 김대리님이 고객사의 피드백을 미리 정리해서 공유해 주셨어요. 덕분에 회의가 훨씬 효율적으로 진행되었습니다. 역시 적극적 소통의 달인! 앞으로도 이런 선제적 소통 문화가 퍼져나갔으면 좋겠습니다.',
                emoji: '💬'
            },
            {
                id: 'p2',
                title: '생산팀의 유연한 공정 변경 대응',
                author: '이준호 / 품질관리팀',
                date: '2026-02-28',
                tag: '유연성',
                content: '급하게 고객사 요청으로 공정 순서가 변경되었는데, 생산팀에서 정말 빠르게 대응해 주셨어요. "원래 이렇게 하는 건데..."라고 하지 않고, "어떻게 하면 가능할까요?"라고 먼저 물어봐 주신 모습이 인상적이었습니다.',
                emoji: '🌊'
            },
            {
                id: 'p3',
                title: '긴급 배송 요청에 달려간 물류팀',
                author: '최민지 / 영업팀',
                date: '2026-02-25',
                tag: '긴박감',
                content: '금요일 오후 늦게 들어온 긴급 배송 요청이었는데, 물류팀에서 주말 출근도 마다하지 않고 월요일 아침까지 배송을 완료해 주셨습니다. 고객사에서도 감사 인사를 전해왔어요. 이것이 바로 긴박감의 실천!',
                emoji: '⚡'
            },
            {
                id: 'p4',
                title: 'R&D팀과 영업팀의 협업 미팅',
                author: '한지수 / R&D팀',
                date: '2026-02-20',
                tag: '적극적 소통',
                content: '보통 부서 간 미팅이 형식적으로 끝나는 경우가 많은데, 이번에는 영업팀에서 먼저 고객 현장의 실제 이슈를 공유해 주셨고, R&D팀에서도 기술적인 해결 방안을 즉석에서 논의했습니다. 정말 소통이 살아있는 미팅이었어요!',
                emoji: '💬'
            }
        ],
        poster: [
            {
                id: 'po1',
                title: '품질관리팀의 고객중심 실천 선언',
                author: '품질관리팀',
                date: '2026-03-02',
                tag: '유연성',
                content: '품질은 고객의 눈으로! 유연한 사고로 최고의 품질을 만들겠습니다.',
                emoji: '🎨'
            },
            {
                id: 'po2',
                title: '영업팀의 적극적 소통 다짐 포스터',
                author: '영업팀',
                date: '2026-02-27',
                tag: '적극적 소통',
                content: '고객의 목소리에 먼저 귀 기울이겠습니다. Talk First, Listen Always!',
                emoji: '🎨'
            },
            {
                id: 'po3',
                title: 'R&D팀 긴박감 실천 포스터',
                author: 'R&D팀',
                date: '2026-02-22',
                tag: '긴박감',
                content: '오늘 할 수 있는 연구, 내일로 미루지 않겠습니다. Speed with Quality!',
                emoji: '🎨'
            }
        ],
        sticker: [
            {
                id: 's1',
                title: 'To. 김영수 과장님',
                author: '정다은 / 인사팀',
                date: '2026-03-01',
                tag: '적극적 소통',
                content: '항상 먼저 인사해 주시고, 다른 팀 업무도 적극적으로 도와주셔서 감사합니다! 커뮤니 스티커를 드립니다 💬',
                emoji: '⭐'
            },
            {
                id: 's2',
                title: 'To. 박미란 주임님',
                author: '오승은 / 생산팀',
                date: '2026-02-26',
                tag: '유연성',
                content: '갑작스러운 일정 변경에도 항상 웃으며 대응해 주시는 미란님! 플렉시 스티커를 붙여드려요 🌊',
                emoji: '⭐'
            },
            {
                id: 's3',
                title: 'To. 이상호 팀장님',
                author: '김현우 / 물류팀',
                date: '2026-02-23',
                tag: '긴박감',
                content: '긴급한 출하 건도 항상 신속하게 처리해 주시는 팀장님! 어전시 스티커 드립니다 ⚡',
                emoji: '⭐'
            }
        ],
        oneword: [
            {
                id: 'o1',
                title: '"오늘도 먼저 인사하기!"',
                author: '강서윤 / 경영지원팀',
                date: '2026-03-02',
                tag: '적극적 소통',
                content: '사내 메신저 상태 메시지에 "오늘도 먼저 인사하기!"를 설정했습니다. 매일 아침 이 문구를 보며 적극적 소통을 실천하려고 합니다.',
                emoji: '💬'
            },
            {
                id: 'o2',
                title: '"변화를 즐기는 사람이 되자"',
                author: '윤태호 / 생산팀',
                date: '2026-02-28',
                tag: '유연성',
                content: '메일 서명에 "변화를 즐기는 사람이 되자 - Flexibility"를 추가했습니다. 메일을 보낼 때마다 유연성을 떠올리게 됩니다.',
                emoji: '💬'
            },
            {
                id: 'o3',
                title: '"Now or Never!"',
                author: '임수빈 / 영업팀',
                date: '2026-02-25',
                tag: '긴박감',
                content: '프로필 상태 메시지를 "Now or Never! ⚡"로 바꿨어요. 미루고 싶은 일이 생길 때마다 이 문구가 다시 한번 힘을 줍니다.',
                emoji: '💬'
            },
            {
                id: 'o4',
                title: '"고객의 시간은 나의 시간"',
                author: '정은주 / 품질관리팀',
                date: '2026-02-20',
                tag: '긴박감',
                content: '메일 서명란에 "고객의 시간은 나의 시간 - Sense of Urgency"를 넣었습니다. 모든 업무에 긴박감을 가지고 임하겠다는 다짐입니다.',
                emoji: '💬'
            }
        ]
    },

    // ===== 초기화 =====
    init() {
        const existing = localStorage.getItem(this.STORAGE_KEY);
        if (!existing) {
            // 샘플 데이터 로드
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sampleData));
        }
    },

    // ===== CRUD 함수들 =====

    // 전체 데이터 가져오기
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : this.sampleData;
    },

    // 특정 카테고리 게시글 가져오기
    getByCategory(category) {
        const all = this.getAll();
        return all[category] || [];
    },

    // 게시글 추가
    add(category, post) {
        const all = this.getAll();
        if (!all[category]) all[category] = [];

        post.id = 'post_' + Date.now();
        post.date = new Date().toISOString().split('T')[0];

        all[category].unshift(post); // 최신글이 위로
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        return post;
    },

    // 게시글 수정
    update(category, postId, updatedData) {
        const all = this.getAll();
        const posts = all[category] || [];
        const index = posts.findIndex(p => p.id === postId);

        if (index !== -1) {
            all[category][index] = { ...posts[index], ...updatedData };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
            return true;
        }
        return false;
    },

    // 게시글 삭제
    delete(category, postId) {
        const all = this.getAll();
        const posts = all[category] || [];
        all[category] = posts.filter(p => p.id !== postId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    },

    // 통계
    getStats() {
        const all = this.getAll();
        return {
            paparazzi: (all.paparazzi || []).length,
            poster: (all.poster || []).length,
            sticker: (all.sticker || []).length,
            oneword: (all.oneword || []).length,
            total: (all.paparazzi || []).length + (all.poster || []).length +
                (all.sticker || []).length + (all.oneword || []).length
        };
    },

    // 최근 게시글 (all)
    getRecent(count = 5) {
        const all = this.getAll();
        const allPosts = [];

        Object.keys(all).forEach(category => {
            all[category].forEach(post => {
                allPosts.push({ ...post, category });
            });
        });

        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        return allPosts.slice(0, count);
    },

    // 데이터 초기화 (샘플 데이터로 리셋)
    resetToSample() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sampleData));
    }
};

// 게시글 데이터 초기화
PostsManager.init();

// ===== 게시글 렌더링 함수 =====
function renderPosts(category) {
    const posts = PostsManager.getByCategory(category);
    const container = document.getElementById(`${category}-posts`);
    const emptyState = document.getElementById(`${category}-empty`);

    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // 태그 색상 매핑
    const tagColors = {
        '적극적 소통': { bg: 'rgba(38, 166, 154, 0.1)', color: '#26A69A' },
        '유연성': { bg: 'rgba(66, 133, 244, 0.1)', color: '#4285F4' },
        '긴박감': { bg: 'rgba(234, 67, 53, 0.1)', color: '#EA4335' }
    };

    container.innerHTML = posts.map(post => {
        const tagStyle = tagColors[post.tag] || tagColors['적극적 소통'];
        const initials = post.author ? post.author.charAt(0) : '?';
        const imageHtml = post.imageData
            ? `<img src="${post.imageData}" alt="${post.title}">`
            : `${post.emoji || '📝'}`;

        return `
      <div class="post-card fade-up visible" onclick="showPostDetail('${category}', '${post.id}')">
        <div class="post-image">${imageHtml}</div>
        <div class="post-body">
          <span class="post-tag" style="background:${tagStyle.bg}; color:${tagStyle.color};">${post.tag || ''}</span>
          <h4 class="post-title">${post.title}</h4>
          <p class="post-preview">${post.content}</p>
          <div class="post-meta">
            <div class="post-author">
              <span class="avatar">${initials}</span>
              <span>${post.author}</span>
            </div>
            <span>${post.date}</span>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

// ===== 게시글 상세 보기 =====
function showPostDetail(category, postId) {
    const posts = PostsManager.getByCategory(category);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    document.getElementById('detail-title').textContent = post.title;

    const detailImage = document.getElementById('detail-image');
    if (post.imageData) {
        detailImage.innerHTML = `<img src="${post.imageData}" alt="${post.title}" style="width:100%; border-radius:12px;">`;
    } else {
        detailImage.innerHTML = `<div style="height:200px; background:var(--gradient-warm); display:flex; align-items:center; justify-content:center; font-size:4rem; border-radius:12px;">${post.emoji || '📝'}</div>`;
    }

    document.getElementById('detail-meta').innerHTML = `
    <span><i class="fas fa-user"></i> ${post.author}</span>
    <span><i class="fas fa-calendar"></i> ${post.date}</span>
    <span><i class="fas fa-tag"></i> ${post.tag || ''}</span>
  `;
    document.getElementById('detail-content').innerHTML = `<p>${post.content}</p>`;

    openModal('detail');
}

// ===== 게시글 작성 처리 =====
function submitPost(event, category) {
    event.preventDefault();

    let post = {};

    switch (category) {
        case 'paparazzi':
            post = {
                title: document.getElementById('papa-title').value,
                author: document.getElementById('papa-author').value,
                tag: document.getElementById('papa-tag').value,
                content: document.getElementById('papa-content').value,
                emoji: '📸'
            };
            // 이미지 처리
            const papaFile = document.getElementById('papa-file').files[0];
            if (papaFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    post.imageData = e.target.result;
                    PostsManager.add(category, post);
                    renderPosts(category);
                    closeModal(category);
                    showToast('제보가 등록되었습니다! 🎉');
                    event.target.reset();
                };
                reader.readAsDataURL(papaFile);
                return;
            }
            break;

        case 'poster':
            post = {
                title: document.getElementById('poster-title').value,
                author: document.getElementById('poster-team').value,
                tag: '포스터',
                content: document.getElementById('poster-title').value,
                emoji: '🎨'
            };
            const posterFile = document.getElementById('poster-file').files[0];
            if (posterFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    post.imageData = e.target.result;
                    PostsManager.add(category, post);
                    renderPosts(category);
                    closeModal(category);
                    showToast('포스터가 업로드되었습니다! 🎨');
                    event.target.reset();
                };
                reader.readAsDataURL(posterFile);
                return;
            }
            break;

        case 'sticker':
            const colleague = document.getElementById('sticker-colleague').value;
            post = {
                title: `To. ${colleague}`,
                author: document.getElementById('sticker-author').value,
                tag: '스티커 인증',
                content: document.getElementById('sticker-message').value,
                emoji: '⭐'
            };
            const stickerFile = document.getElementById('sticker-file').files[0];
            if (stickerFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    post.imageData = e.target.result;
                    PostsManager.add(category, post);
                    renderPosts(category);
                    closeModal(category);
                    showToast('스티커 인증이 완료되었습니다! ⭐');
                    event.target.reset();
                };
                reader.readAsDataURL(stickerFile);
                return;
            }
            break;

        case 'oneword':
            const keyword = document.getElementById('oneword-keyword').value;
            post = {
                title: `"${document.getElementById('oneword-message').value.substring(0, 30)}..."`,
                author: document.getElementById('oneword-author').value,
                tag: keyword,
                content: document.getElementById('oneword-message').value,
                emoji: '💬'
            };
            const onewordFile = document.getElementById('oneword-file').files[0];
            if (onewordFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    post.imageData = e.target.result;
                    PostsManager.add(category, post);
                    renderPosts(category);
                    closeModal(category);
                    showToast('Come On 한마디가 등록되었습니다! 💬');
                    event.target.reset();
                };
                reader.readAsDataURL(onewordFile);
                return;
            }
            break;
    }

    PostsManager.add(category, post);
    renderPosts(category);
    closeModal(category);
    showToast('게시글이 등록되었습니다! ✨');
    event.target.reset();
}

// ===== 페이지 로드 시 모든 카테고리 렌더링 =====
document.addEventListener('DOMContentLoaded', function () {
    ['paparazzi', 'poster', 'sticker', 'oneword'].forEach(cat => {
        renderPosts(cat);
    });
});
