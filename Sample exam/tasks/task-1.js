function solve() {
    var module = (function () {
        var player,
            playlist,
            playable,
            audio,
            video;

        function validateString(string) {
            if (typeof string !== 'string' || string.length < 3 || string.length > 25) {
                throw new Error();
            }
        }

        player = (function () {
            var playerId = 0,
                player = {
                    init: function (name) {
                        this.name = name;
                        this.id = playerId += 1;
                        this.playlists = [];

                        return this;
                    },
                    addPlaylist: function (playlistToAdd) {
                        if (!playlist.isPrototypeOf(playlistToAdd)) {
                            throw new Error();
                        }

                        this.playlists.push(playlistToAdd);

                        return this;
                    },
                    getPlaylistById: function (id) { //check if id is undefined
                        var playlist = this.playlists.find(function (playlist) {
                            return id === playlist.id;
                        });

                        if (playlist === undefined) {
                            return null;
                        }

                        return playlist;
                    },
                    removePlaylist: function (id/*playlist*/) {
                        if (id.hasOwnProperty('id')) {
                            id = id.id;
                        }

                        var index = this.playlists.findIndex(function (playlist) {
                            return playlist.id == id;
                        });

                        if (index < 0) {
                            throw new Error();
                        }

                        this.playlists.splice(index, 1);

                        return this;
                    },
                    listPlaylists: function (page, size) {
                        if (typeof(page) === 'undefined' ||
                            typeof(size) === 'undefined' ||
                            page < 0 ||
                            size <= 0 ||
                            page * size > this.playlists.length) {
                            throw new Error();
                        }

                        this.playlists.sort(function (prev, next) {
                            if (prev.name === next.name) {
                                return prev.id - next.id;
                            }

                            return prev.name.localeCompare(next.name);
                        });

                        return this.playlists.slice(page * size, (page + 1) * size);
                    },
                    contains: function (playable, playlist) {

                    },
                    search: function (pattern) {

                    }
                };

            Object.defineProperties(player, {
                name: {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        validateString(value);
                        this._name = value;
                    }
                }
            });

            return player;
        }());

        playlist = (function () {
            var playlistId = 0,
                playlist = {
                    init: function (name) {
                        this.name = name;
                        this.id = playlistId += 1;

                        return this;
                    },
                    addPlayable: function (playable) {

                        return this;
                    },
                    getPlayableById: function (id) {

                    },
                    removePlayable: function (id/*playable*/) {

                        return this;
                    },
                    listPlaylables: function (page, size) {

                    }
                };

            Object.defineProperties(playlist, {
                name: {
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        validateString(value);
                        this._name = value;
                    }
                }
            });

            return playlist;
        }());

        playable = (function () {
            var playableId = 0,
                playable = {
                    init: function (title, author) {
                        this.title = title;
                        this.author = author;
                        this.id = playableId += 1;

                        return this;
                    },
                    play: function () {
                        return this.id + '. ' + this.title + ' - ' + this.author;
                    }
                };

            Object.defineProperties(playable, {
                title: {
                    get: function () {
                        return this._title;
                    },
                    set: function (value) {
                        validateString(value);
                        this._title = value;
                    }
                },
                author: {
                    get: function () {
                        return this._author;
                    },
                    set: function (value) {
                        validateString(value);
                        this._author = value;
                    }
                }
            });

            return playable;
        }());

        audio = (function (parent) {
            var audio = Object.create(parent);

            audio.init = function (title, author, length) {
                parent.init.call(this, title, author);
                this.length = length;

                return this;
            };

            audio.play = function () {
                return parent.play.call(this) + ' - ' + this.length;
            };

            return audio;
        }(playable));

        video = (function (parent) {
            var video = Object.create(parent);

            video.init = function (title, author, imdbRating) {
                parent.init.call(this, title, author);
                this.imdbRating = imdbRating;

                return this;
            };
            video.play = function () {
                return parent.play.call(this) + ' - ' + this.imdbRating;
            };

            return video;
        }(playable));

        return {
            getPlayer: function (name) {
                return Object.create(player).init(name);
            },
            getPlaylist: function (name) {
                return Object.create(playlist).init(name);
            },
            getAudio: function (title, author, length) {
                return Object.create(audio).init(title, author, length);
            },
            getVideo: function (title, author, imdbRating) {
                return Object.create(video).init(title, author, imdbRating);
            }
        }
    }());

    return module;
}

module.exports = solve;