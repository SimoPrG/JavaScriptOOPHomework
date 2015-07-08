function solve() {
    var module = (function () {
        var Player,
            currentPlayerId = 0,
            Playlist,
            currentPlaylistId = 0,
            Playable,
            currentPlayableId = 0,
            Audio,
            Video,
            validator,
            CONSTANTS = {
                TEXT_MIN_LENGTH: 3,
                TEXT_MAX_LENGTH: 25,
                IMDB_MIN_RATING: 1,
                IMDB_MAX_RATING: 5,
                MAX_NUMBER: 9007199254740992
            };

        function indexOfElementWithIdInCollection(collection, id) {
            var i, len;
            for (i = 0, len = collection.length; i < len; i++) {
                if (collection[i].id == id) {
                    return i;
                }
            }

            return -1;
        }

        function getSortingFunction(firstParameter, secondParameter) {
            return function (first, second) {
                if (first[firstParameter] < second[firstParameter]) {
                    return -1;
                }
                else if (first[firstParameter] > second[firstParameter]) {
                    return 1;
                }

                if (first[secondParameter] < second[secondParameter]) {
                    return -1;
                }
                else if (first[secondParameter] > second[secondParameter]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }

        validator = {
            validateIfUndefined: function (val, name) {
                name = name || 'Value';
                if (val === undefined) {
                    throw new Error(name + ' cannot be undefined');
                }
            },
            validateIfObject: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'object') {
                    throw new Error(name + ' must be an object');
                }
            },
            validateIfNumber: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'number') {
                    throw new Error(name + ' must be a number');
                }
            },
            validateString: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);

                if (typeof val !== 'string') {
                    throw new Error(name + ' must be a string');
                }

                if (val.length < CONSTANTS.TEXT_MIN_LENGTH
                    || CONSTANTS.TEXT_MAX_LENGTH < val.length) {
                    throw new Error(name + ' must be between ' + CONSTANTS.TEXT_MIN_LENGTH +
                        ' and ' + CONSTANTS.TEXT_MAX_LENGTH + ' symbols');
                }
            },
            validatePositiveNumber: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                this.validateIfNumber(val, name);

                if (val <= 0) {
                    throw new Error(name + ' must be positive number');
                }
            },
            validateImdbRating: function (val) {
                this.validateIfUndefined(val, 'IMDB Rating');
                this.validateIfNumber(val, 'IMDB Rating');

                if (val < CONSTANTS.IMDB_MIN_RATING || CONSTANTS.IMDB_MAX_RATING < val) {
                    throw new Error('IMDB Rating must be between '
                        + CONSTANTS.IMDB_MIN_RATING
                        + ' and ' + CONSTANTS.IMDB_MAX_RATING);
                }
            },
            validateId: function (id) {
                this.validateIfUndefined(id, 'Object id');
                if (typeof id !== 'number') {
                    id = id.id;
                }

                this.validateIfUndefined(id, 'Object must have id');
                return id;
            },
            validatePageAndSize: function (page, size, maxElements) {
                this.validateIfUndefined(page);
                this.validateIfUndefined(size);
                this.validateIfNumber(page);
                this.validateIfNumber(size);

                if (page < 0) {
                    throw new Error('Page must be greather than or equal to 0');
                }

                this.validatePositiveNumber(size, 'Size');

                if (page * size > maxElements) {
                    throw new Error('Page * size will not return any elements from collection');
                }
            }
        };

        Player = function (name) {
            this.name = name;
            this._id = ++currentPlayerId;
            this._playlists = [];
        };

        Object.defineProperty(Player.prototype, 'id', {
            get: function () {
                return this._id;
            }
        });

        Object.defineProperty(Player.prototype, 'name', {
            get: function () {
                return this._name;
            },
            set: function (val) {
                validator.validateString(val, 'Player name');
                this._name = val;
            }
        });

        Object.defineProperty(Player.prototype, 'addPlaylist', {
            value: function (playlist) {
                validator.validateIfUndefined(playlist, 'Player add playlist parameter');
                if (playlist.id === undefined) {
                    throw new Error('Player add playlist parameter must have id');
                }

                this._playlists.push(playlist);
                return this;
            }
        });

        Object.defineProperty(Player.prototype, 'getPlaylistById', {
            value: function (id) {
                validator.validateIfUndefined(id, 'Player get playlist parameter id');
                validator.validateIfNumber(id, 'Player get playlist paratemeter id');

                var foundIndex = indexOfElementWithIdInCollection(this._playlists, id);
                if (foundIndex < 0) {
                    return null;
                }

                return this._playlists[foundIndex];
            }
        });

        Object.defineProperty(Player.prototype, 'removePlaylist', {
            value: function (id) {
                id = validator.validateId(id);

                var foundIndex = indexOfElementWithIdInCollection(this._playlists, id);
                if (foundIndex < 0) {
                    throw new Error('Playlist with id ' + id + ' was not found in player');
                }

                this._playlists.splice(foundIndex, 1);

                return this;
            }
        });

        Object.defineProperty(Player.prototype, 'listPlaylists', {
            value: function (page, size) {
                validator.validatePageAndSize(page, size, this._playlists.length);

                return this._playlists
                    .slice()
                    .sort(getSortingFunction('name', 'id'))
                    .splice(page * size, size);
            }
        });

        Object.defineProperty(Player.prototype, 'contains', {
            value: function (playable, playlist) {
                validator.validateIfUndefined(playable);
                validator.validateIfUndefined(playlist);
                var playableId = validator.validateId(playable.id);
                var playlistId = validator.validateId(playlist.id);

                var playlist = this.getPlaylistById(playlistId);
                if (playlist == null) {
                    return false;
                }

                var playable = playlist.getPlayableById(playableId);
                if (playable == null) {
                    return false;
                }

                return true;
            }
        });

        Object.defineProperty(Player.prototype, 'search', {
            value: function (pattern) {
                validator.validateString(pattern, 'Search pattern');

                return this._playlists
                    .filter(function (playlist) {
                        return playlist
                            .listPlayables()
                            .some(function (playable) {
                                return playable.length !== undefined
                                    && playable
                                        .title
                                        .toLowerCase()
                                        .indexOf(pattern.toLowerCase()) >= 0;
                            });
                    })
                    .map(function (playlist) {
                        return {
                            id: playlist.id,
                            name: playlist.name
                        }
                    });
            }
        });

        Playlist = function (name) {
            this.name = name;
            this._id = ++currentPlaylistId;
            this._playables = [];
        };

        Object.defineProperty(Playlist.prototype, 'id', {
            get: function () {
                return this._id;
            }
        });

        Object.defineProperty(Playlist.prototype, 'name', {
            get: function () {
                return this._name;
            },
            set: function (val) {
                validator.validateString(val, 'Playlist name');
                this._name = val;
            }
        });

        Object.defineProperty(Playlist.prototype, 'addPlayable', {
            value: function (playable) {
                validator.validateIfUndefined(playable, 'Playlist add playable parameter');
                validator.validateIfObject(playable, 'Playlist add playable parameter');
                validator.validateIfUndefined(playable.id, 'Playlist add playable parameter must have id');

                this._playables.push(playable);
                return this;
            }
        });

        Object.defineProperty(Playlist.prototype, 'getPlayableById', {
            value: function (id) {
                validator.validateIfUndefined(id, 'Playlist get playable parameter id');
                validator.validateIfNumber(id, 'Playlist get playable paratemeter id');

                var foundIndex = indexOfElementWithIdInCollection(this._playables, id);
                if (foundIndex < 0) {
                    return null;
                }

                return this._playables[foundIndex];
            }
        });

        Object.defineProperty(Playlist.prototype, 'removePlayable', {
            value: function (id) {
                id = validator.validateId(id);

                var foundIndex = indexOfElementWithIdInCollection(this._playables, id);
                if (foundIndex < 0) {
                    throw new Error('Playable with id ' + id + ' was not found in playlist');
                }

                this._playables.splice(foundIndex, 1);

                return this;
            }
        });

        Object.defineProperty(Playlist.prototype, 'listPlayables', {
            value: function (page, size) {
                page = page || 0;
                size = size || CONSTANTS.MAX_NUMBER;
                validator.validatePageAndSize(page, size, this._playables.length);

                return this
                    ._playables
                    .slice()
                    .sort(getSortingFunction('title', 'id'))
                    .splice(page * size, size);
            }
        });

        Playable = function (title, author) {
            this.title = title;
            this.author = author;
            this._id = ++currentPlayableId;
        };

        Object.defineProperty(Playable.prototype, 'id', {
            get: function () {
                return this._id;
            }
        });

        Object.defineProperty(Playable.prototype, 'title', {
            get: function () {
                return this._title;
            },
            set: function (val) {
                validator.validateString(val, 'Playable Title');
                this._title = val;
            }
        });

        Object.defineProperty(Playable.prototype, 'author', {
            get: function () {
                return this._author;
            },
            set: function (val) {
                validator.validateString(val, 'Playable Author');
                this._author = val;
            }
        });

        Object.defineProperty(Playable.prototype, 'play', {
            value: function () {
                return this.id + '. ' + this.title + ' - ' + this.author;
            }
        });

        Audio = function (title, author, length) {
            Playable.call(this, title, author);
            this.length = length;
        };

        Audio.prototype = Object.create(Playable.prototype);
        Audio.prototype.constructor = Audio;

        Object.defineProperty(Audio.prototype, 'length', {
            get: function () {
                return this._length;
            },
            set: function (val) {
                validator.validatePositiveNumber(val, 'Audio Length');
                this._length = val;
            }
        });

        Object.defineProperty(Audio.prototype, 'play', {
            value: function () {
                return Playable.prototype.play.call(this) + ' - ' + this.length;
            }
        });

        Video = function (title, author, imdbRating) {
            Playable.call(this, title, author);
            this.imdbRating = imdbRating;
        };

        Video.prototype = Object.create(Playable.prototype);
        Video.prototype.constructor = Video;

        Object.defineProperty(Video.prototype, 'imdbRating', {
            get: function () {
                return this._imdbRating;
            },
            set: function (val) {
                validator.validateImdbRating(val);
                this._imdbRating = val;
            }
        });

        Object.defineProperty(Video.prototype, 'play', {
            value: function () {
                return Playable.prototype.play.call(this) + ' - ' + this.imdbRating;
            }
        });

        return {
            getPlayer: function (name) {
                return new Player(name);
            },
            getPlaylist: function (name) {
                return new Playlist(name);
            },
            getAudio: function (title, author, length) {
                return new Audio(title, author, length);
            },
            getVideo: function (title, author, imdbRating) {
                return new Video(title, author, imdbRating);
            }
        };
    }());

    return module;
}
