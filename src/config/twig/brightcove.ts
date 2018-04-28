interface VideoI {
  accountId: string;
  playerId: string;
}

export default class Brightcove {
  private static players: any = {};

  public static store(video: VideoI): void {
    const playerId = video.playerId;
    this.players[playerId] = this.players[playerId] || video;
  }

  public static get() {
    return this.players;
  }
}

 // const BrightcoveHandler = new Brightcove();
