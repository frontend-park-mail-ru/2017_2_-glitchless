import { objToMap, mapToObj } from '../utils/mapUtils';

export default class LeaderboardModel {
    constructor(serviceLocator) {
        this._scores = new Map();
        this._currentUserName = null;
        this._isDirty = false;
        this._api = serviceLocator.stubApi;

        this._loadFromLocalStorage();
    }

    get scores() {
        return this._scores;
    }

    get currentUserScore() {
        return this._scores.get(this._currentUserName);
    }

    set currentUserScore(value) {
        this._scores.set(this._currentUserName, value);
        this._isDirty = true;
    }

    get currentUserName() {
        return this._currentUserName;
    }

    set currentUserName(value) {
        this._currentUserName = value;
        this._isDirty = false;
        this._saveToLocalStorage();
    }

    get isDirty() {
        return this._isDirty;
    }

    load() {
        return this._api.get('leaderboard')
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this._scores = new Map();
                json.scores.forEach((entry) => {
                    this._scores.set(entry.user, entry.score);
                });
            }).then(() => {
                this._saveToLocalStorage();
            });
    }

    saveCurrentUserScore() {
        this._saveToLocalStorage();
        return this._api.post('leaderboard', {score: this._scores.get(this._currentUserName)})
    }

    canSaveCurrentUserScore() {
        return this._scores.has(this._currentUserName);
    }

    sync() {
        if (!this._isDirty) {
            return this.load();
        }
        return this.saveCurrentUserScore().then(() => this.load());
    }

    _saveToLocalStorage() {
        const serializedLeaderboard = JSON.stringify(
            {_isDirty: this._isDirty, _currentUserName: this._currentUserName, _scores: mapToObj(this._scores)});

        localStorage.setItem('leaderboard', serializedLeaderboard)
    }

    _loadFromLocalStorage() {
        const serializedLeaderboard = localStorage.getItem('leaderboard');
        if (!serializedLeaderboard) {
            return;
        }
        const serializedLeaderboardObj = JSON.parse(serializedLeaderboard);

        this._isDirty = serializedLeaderboardObj._isDirty;
        this._currentUserName = serializedLeaderboardObj._currentUserName;
        this._scores = objToMap(serializedLeaderboardObj._scores);
    }
}