module.exports = (session, passport) => {
    return {
        express_session:
            (socket, next) => { session(socket.request, {}, next) },
        passport_initialize:
            (socket, next) => { passport.initialize()(socket.request, {},next)},
        passport_session:
            (socket, next) => { passport.session()(socket.request, {}, next) }
    }
}