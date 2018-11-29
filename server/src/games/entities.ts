import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm';
import User from '../users/entity';
import {defaultBoard} from './boards';

export type PlayerSymbol = 'x' | 'o' | '☆' | 'ᗣ';
export type ObstacleSymbol = '▩' | '□' | '▣';
export type ExplosionSymbol = '-' | '|' | '>' | '<' | '^' | 'v';
export type Symbol = PlayerSymbol | ObstacleSymbol | ExplosionSymbol | '💣';
export type Row = (Symbol | null)[];
export type Board = Row[];
export type Position = [ number, number ];
export interface ExplosionPos {
  '+': Position[],
  '-': Position[],
  '|': Position[],
  '>': Position[],
  '<': Position[],
  '^': Position[],
  'v': Position[],
}

type Status = 'pending' | 'started' | 'finished';

// const BOARD_SIZE = [17, 15];

// const emptyRow: Row = Array(BOARD_SIZE[0]).fill(null);
// const emptyBoard: Board = Array(BOARD_SIZE[1]).fill(emptyRow);



@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: defaultBoard})
  board: Board

  @Column('char', {length:1, nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]

  @OneToMany(_ => Bomb, bomb => bomb.game, {eager:true})
  activeBombs: Bomb[]

  @OneToMany(_ => Explosion, explosion => explosion.game, {eager:true})
  activeExplosions: Explosion[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column()
  userId: number

  @Column('char', {length: 1})
  symbol: PlayerSymbol

  @Column('json', {default: [0,0]})
  position: Position

  @Column('boolean', {default: false})
  dead: boolean 
}

@Entity()
export class Bomb extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => Game, game => game.activeBombs)
  game: Game 

  @Column('json', {default: [0,0]})
  position: Position
}

@Entity()
export class Explosion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => Game, game => game.activeExplosions)
  game: Game 

  @Column('json', {default: [0,0]})
  position: ExplosionPos
}