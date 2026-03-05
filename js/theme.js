/* ============================================
   theme.js - 테마 커스터마이징 시스템
   CSS Custom Properties를 통한 실시간 디자인 변경
   ============================================ */

const ThemeManager = {
  // 기본 테마 설정값
  defaults: {
    bgPrimary: '#FFFDE7',
    bgSecondary: '#FFF8E1',
    accentMint: '#26A69A',
    accentMintLight: '#4DB6AC',
    accentMintDark: '#00897B',
    textPrimary: '#2D3436',
    textSecondary: '#636E72',
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '16px'
  },

  // 테마 초기화
  init() {
    const savedTheme = localStorage.getItem('comeon-theme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      this.apply(theme);
    }
  },

  // 테마 적용 (CSS Custom Properties에 반영)
  apply(theme) {
    const root = document.documentElement;
    
    if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
    if (theme.bgSecondary) root.style.setProperty('--bg-secondary', theme.bgSecondary);
    if (theme.accentMint) {
      root.style.setProperty('--accent-mint', theme.accentMint);
      // 밝은/어두운 버전도 자동 계산
      root.style.setProperty('--accent-mint-bg', this.hexToRgba(theme.accentMint, 0.08));
      root.style.setProperty('--shadow-mint', `0 4px 20px ${this.hexToRgba(theme.accentMint, 0.2)}`);
    }
    if (theme.accentMintLight) root.style.setProperty('--accent-mint-light', theme.accentMintLight);
    if (theme.accentMintDark) root.style.setProperty('--accent-mint-dark', theme.accentMintDark);
    if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
    if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);
    if (theme.fontFamily) root.style.setProperty('--font-family', theme.fontFamily);
    if (theme.fontSize) root.style.fontSize = theme.fontSize;

    // 그라데이션 업데이트
    if (theme.bgPrimary && theme.accentMint) {
      const mintLight = theme.accentMintLight || this.lightenColor(theme.accentMint, 60);
      root.style.setProperty('--gradient-hero', 
        `linear-gradient(135deg, ${theme.bgPrimary} 0%, ${this.lightenColor(theme.accentMint, 80)} 50%, ${this.lightenColor(theme.accentMint, 60)} 100%)`
      );
      root.style.setProperty('--gradient-mint', 
        `linear-gradient(135deg, ${theme.accentMint} 0%, ${theme.accentMintLight || mintLight} 100%)`
      );
    }
  },

  // 테마 저장
  save(theme) {
    localStorage.setItem('comeon-theme', JSON.stringify(theme));
    this.apply(theme);
  },

  // 기본값으로 리셋
  reset() {
    localStorage.removeItem('comeon-theme');
    const root = document.documentElement;
    // 모든 인라인 스타일 제거하여 CSS 기본값 복원
    root.removeAttribute('style');
  },

  // 현재 테마 가져오기
  getCurrent() {
    const saved = localStorage.getItem('comeon-theme');
    return saved ? JSON.parse(saved) : { ...this.defaults };
  },

  // === 유틸리티 함수 ===

  // HEX → RGBA 변환
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // 색상 밝게 만들기
  lightenColor(hex, percent) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const newR = Math.min(255, r + Math.round((255 - r) * percent / 100));
    const newG = Math.min(255, g + Math.round((255 - g) * percent / 100));
    const newB = Math.min(255, b + Math.round((255 - b) * percent / 100));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
};

// 페이지 로드 시 테마 초기화
ThemeManager.init();
