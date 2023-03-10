import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .where('title ILIKE :title', { title: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count: [{ count: string }] = await this.repository.query(
      'SELECT COUNT(*) AS "count" FROM games'
    );

    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder('game')
      .where('game.id = :id', { id })
      .leftJoinAndSelect('game.users', 'user')
      .getOne();

    return game!.users;
  }
}
