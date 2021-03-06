import * as request from 'superagent';
import {baseUrl} from '../constants';
import {logout} from './users';
import {isExpired} from '../jwt';

export const ADD_GAME = 'ADD_GAME';
export const UPDATE_GAME = 'UPDATE_GAME';
export const UPDATE_GAMES = 'UPDATE_GAMES';
export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS';
export const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS';
export const START_GAME_SUCCESS = 'START_GAME_SUCCESS';
export const PLACE_BOMB_SUCCESS = 'PLACE_BOMB_SUCCESS';
export const FIRE_FLAME_SUCCESS = 'FIRE_FLAME_SUCCESS';

const updateGames = games => ({
  type: UPDATE_GAMES,
  payload: games
});

const addGame = game => ({
  type: ADD_GAME,
  payload: game
});

const updateGameSuccess = () => ({
  type: UPDATE_GAME_SUCCESS
});

const joinGameSuccess = () => ({
  type: JOIN_GAME_SUCCESS
});

const startGameSuccess = () => ({
  type: START_GAME_SUCCESS
});

const placeBombSuccess = () => ({
  type: PLACE_BOMB_SUCCESS
});

const fireFlameSuccess = () => ({
  type: FIRE_FLAME_SUCCESS
});



export const getGames = () => (dispatch, getState) => {
  const state = getState();
  if (!state.currentUser) return null;
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .get(`${baseUrl}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(updateGames(result.body)))
    .catch(err => console.error(err));
}

export const joinGame = (gameId) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .post(`${baseUrl}/games/${gameId}/players`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(_ => dispatch(joinGameSuccess()))
    .catch(err => console.error(err));
}

export const startGame = (gameId) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .patch(`${baseUrl}/games/${gameId}/start`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(_ => dispatch(startGameSuccess()))
    .catch(err => console.error(err));
}

export const createGame = () => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .post(`${baseUrl}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(addGame(result.body)))
    .catch(err => console.error(err));
}

export const updateGame = (gameId, board) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .patch(`${baseUrl}/games/${gameId}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ board })
    .then(_ => dispatch(updateGameSuccess()))
    .catch(err => console.error(err));
}

export const updateCurrentPlayerPosition = (gameId, position, facing) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .patch(`${baseUrl}/games/${gameId}/players`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ position, facing })
    .then(_ => dispatch(updateGameSuccess()))
    .catch(err => console.error(err));    
}

export const placeBomb = (gameId, position, playerId) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .post(`${baseUrl}/games/${gameId}/bombs`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ position, playerId })
    .then(_ => dispatch(placeBombSuccess()))
    .catch(err => console.error(err));
}

export const fireFlame = (gameId, position, facing) => (dispatch, getState) => {
  const state = getState();
  const jwt = state.currentUser.jwt;

  if (isExpired(jwt)) return dispatch(logout());

  request
    .post(`${baseUrl}/games/${gameId}/flames`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ position, facing })
    .then(_ => dispatch(fireFlameSuccess()))
    .catch(err => console.error(err));    
}