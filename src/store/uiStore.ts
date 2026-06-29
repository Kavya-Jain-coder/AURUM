import { create } from 'zustand';

interface UiState {
  // Scroll
  scrollProgress: number;       // 0–1 across entire 500vh
  activeChapter: number;        // 0–4
  chapterProgress: number;      // 0–1 within active chapter

  // Device
  isMobile: boolean;

  // Cursor
  cursorVariant: 'default' | 'link' | 'model' | 'cta';

  // Loading
  isLoading: boolean;
  loadingProgress: number;      // 0–1

  // Page
  isShopMode: boolean;          // true when in e-commerce pages

  // Actions
  setScrollProgress: (progress: number) => void;
  setActiveChapter: (chapter: number) => void;
  setChapterProgress: (progress: number) => void;
  setIsMobile: (isMobile: boolean) => void;
  setCursorVariant: (variant: 'default' | 'link' | 'model' | 'cta') => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setIsShopMode: (shopMode: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  scrollProgress: 0,
  activeChapter: 0,
  chapterProgress: 0,
  isMobile: false,
  cursorVariant: 'default',
  isLoading: true,
  loadingProgress: 0,
  isShopMode: false,

  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  setChapterProgress: (progress) => set({ chapterProgress: progress }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setIsShopMode: (shopMode) => set({ isShopMode: shopMode }),
}));
