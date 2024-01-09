/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
'use strict';
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import http from "http";
import serveIndex from "serve-index";
import engines from "./engines.js";
import config from "./config.js";
import { yo } from "yoo-hoo";
import events from "events";
import startup from "./startup.js";
import { Server } from "socket.io";

const __filename = fileURLToPath(
    import.meta.url
);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.Server(app);
const engine = engines[process.env.ENGINE]
const router = engine.router
const {
    startAllSessions
} = startup;

const io = new Server(server, {
    cors: {
        origins: ["*"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

events.EventEmitter.prototype._maxListeners = 999;

app.use(cors());
app.use(express.json({
    limit: '50mb'
}));

// ? Disabling UI (HTML)
/*
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);
app.use(express.static('public'));
express.static(path.join(__dirname, '/public'));
app.use('/files', express.static('files-received'), serveIndex('files-received', {
    icons: true
}));
*/
/*
app.get('/start', function(req, res) {
    res.render('index', {
        port: config.port,
        host: config.host,
        host_ssl: config.host_ssl
    })
});
*/

app.use((req, res, next) => {
    req.io = io;
    next();
});

// * All Routes by Engine (Engine Whatsapp-Web-JS, WPPConnect or Venom)
app.use(router);

io.on('connection', sock => {
    console.log(`ID: ${sock.id} socket in`)

    sock.on('event', data => {
        console.log(data)
    });

    sock.on('disconnect', () => {
        console.log(`ID: ${sock.id} socket out`)
    });
});

if (config.https == 1) {
    https.createServer({
        key: fs.readFileSync(config.ssl_key_path),
        cert: fs.readFileSync(config.ssl_cert_path)
    }, server).listen(
        config.port,
        async(error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('\n\nWelcome to')
                yo('Divnet', {
                    color: 'rainbow',
                    spacing: 1,
                });
                console.log(`Http server running on ${config.host}:${config.port}\n\n`);
                if (config.start_all_sessions == 'true') {
                    let result = await startAllSessions()
                    if (result != undefined) {
                        console.log(result)
                    }
                }
            }
        });
} else {
    server.listen(
        config.port,
        async(error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('\n\nWelcome to:')
                yo('Divnet', {
                    color: 'rainbow',
                    spacing: 1,
                });
                console.log('- Customized by @alexandreclayton - Divnet')
                console.log(`- On Engine: ${engine.descricao}`)
                console.log(`- Sessions Path: ${config.firebaseSessionPath}`)
                console.log(`- Http server running on ${config.host}:${config.port}\n\n`);
                if (config.start_all_sessions == 'true') {
                    let result = await startAllSessions()
                    if (result != undefined) {
                        console.log(result)
                    }
                }
            }
        });
}

process.stdin.resume();

async function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('cleanup');
        await Sessions.getSessions().forEach(async session => {
            await Sessions.closeSession(session);
        });
    }
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }

    if (options.exit) {
        process.exit();
    }
}

process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR1', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
    exit: true
}));
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));