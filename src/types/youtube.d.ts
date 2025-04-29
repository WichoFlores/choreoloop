
// Type definitions for YouTube IFrame Player API
declare namespace YT {
  interface PlayerOptions {
    width?: number;
    height?: number;
    videoId?: string;
    playerVars?: {
      autoplay?: number;
      controls?: number;
      disablekb?: number;
      enablejsapi?: number;
      end?: number;
      fs?: number;
      hl?: string;
      iv_load_policy?: number;
      list?: string;
      listType?: string;
      loop?: number;
      modestbranding?: number;
      origin?: string;
      playlist?: string;
      playsinline?: number;
      rel?: number;
      start?: number;
      mute?: number;
    };
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: OnPlaybackQualityChangeEvent) => void;
      onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
      onApiChange?: (event: PlayerEvent) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: PlayerState;
  }

  interface OnPlaybackQualityChangeEvent extends PlayerEvent {
    data: string;
  }

  interface OnPlaybackRateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }

  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions);
    loadVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    cueVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    loadVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): void;
    cueVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): void;
    loadPlaylist(playlist: string | string[], index?: number, startSeconds?: number, suggestedQuality?: string): void;
    cuePlaylist(playlist: string | string[], index?: number, startSeconds?: number, suggestedQuality?: string): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    clearVideo(): void;
    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    setPlaybackRate(suggestedRate: number): void;
    getPlaybackRate(): number;
    getAvailablePlaybackRates(): number[];
    setLoop(loopPlaylists: boolean): void;
    setShuffle(shufflePlaylist: boolean): void;
    getVideoLoadedFraction(): number;
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    destroy(): void;
    addEventListener(event: string, listener: string): void;
    removeEventListener(event: string, listener: string): void;
    getIframe(): HTMLIFrameElement;
    getOptions(): string[];
    getOption(option: string): any;
    setOption(option: string, value: any): void;
    setOptions(options: object): void;
  }
}
