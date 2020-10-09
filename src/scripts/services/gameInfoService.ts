import axios from 'axios';
import { Game } from './game.model';


export default class GameInfoService {

  constructor() {
    
  }

  async getGames():Promise<Game[]>{
    return await (await axios.get('/app/games')).data;
  }

}
