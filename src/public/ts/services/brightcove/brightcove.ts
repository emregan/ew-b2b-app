import * as $ from 'jquery';
// @TODO import videojs typein
declare const videojs:any;

// interface PlayerMapI{
//     [key:string]: videojs.Player;
// }

export default class Brightcove{
    private players:string = `video${$.hookStr('brightcove-video')}`;
    private playerMap = {};

    constructor(
        public container:JQuery
    ){
        this.mapPlayers();
    }

    private mapPlayers(){
        this.container.find(this.players).each( this.storePlayer.bind(this) );
    }

    private storePlayer(i:number, el:HTMLElement){
        let key = $(el).attr('id') || '';
        const playerID = key.replace('_html5_api', '');
        this.playerMap[key] = videojs.players[playerID];
    }

    public getPlayer(id){
        return this.playerMap[id];
    }

    public play(id){
        const player = this.getPlayer(id);
        if (player) {
            player.play();
        }
    }

    public pause(id){
        const player = this.getPlayer(id);

        if (player) {
            player.pause();
        }
    }
}
