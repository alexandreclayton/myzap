/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../../controllers/sessions.js';
import get from "async-get-file";
import path from 'path';
import fs from 'fs';
import util from 'util';
import urlExistsImport from 'url-exists';
const urlExists = util.promisify(urlExistsImport);

export default class Mensagens {

    static async sendText(req, res) {
        let data = Sessions.getSession(req.body.session)
        let isGroup = req.body.isGroup;
        let number = isGroup === true ? req.body.number + '@g.us' : req.body.number + '@c.us';

        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendText(number, req.body.text)
                return res.status(200).json({
                    result: 200,
                    type: 'text',
                    session: req.body.session,
                    messageId: response.id,
                    from: response.from.split('@')[0],
                    to: response.chatId.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(500).json({
                    result: 500,
                    error: error
                })
            }
        }
    }

    static async sendImage(req, res) {
        try {
            const { caption, path } = req.body;
            let data = Sessions.getSession(req.body.session)
            let number = req.body.number + '@c.us';
            if (!path) {
                return res.status(400).send({
                    status: 400,
                    error: "Path não informado",
                    message: "Informe o caminho da imagem. Exemplo: C:\\folder\\image.jpg caso a imagem esteja local ou uma URL caso a imagem a ser enviada esteja na internet"
                });
            }
            let response = await data.client.sendImage(number, path, 'imagem', caption)
            return res.status(200).json({
                result: 200,
                type: 'image',
                messageId: response?.id ?? '',
                session: req?.body?.session ?? '',
                from: '',
                to: req?.body?.number ?? '',
                file: path,
                caption
            })
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }
    }

    static async sendVideo(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.mp4 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();
        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendFile(number, dir + name, 'Video', req.body.caption)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }
            if (!isURL) {

                let response = await data.client.sendFile(number, req.body.path, 'Video', req.body.caption)

                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }

        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }
    }

    static async sendSticker(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\imagem.jpg para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();
        try {
            if (isURL) {
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendImageAsSticker(number, `./files-received/${name}`)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    messageId: response.id,
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }
            if (!isURL) {
                let response = await data.client.sendImageAsSticker(number, req.body.path)
                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    messageId: response.id,
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }

    }

    static async sendFile(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.xlsx para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req?.body?.session)
        let number = `${req.body.number}@c.us`;
        let isURL = await urlExists(req?.body?.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendFile(number, `${dir}${name}`, req?.body?.fileName, req?.body?.caption)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }
            if (!isURL) {
                let response = await data.client.sendFile(number, req?.body?.path, req?.body?.fileName, req?.body?.caption)
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    session: req.body.session,
                    file: name,
                    data: response
                })
            }
        } catch (error) {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "log": error
            })
        }
    }

    static async sendFile64(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path em formato Base64"
            });
        }
        let data = Sessions.getSession(req?.body?.session)
        let number = `${req?.body?.number}@c.us`;
        let name = req?.body?.path.split(/[\/\\]/).pop();
        try {
            let response = await data.client.sendFileFromBase64(number, req?.body?.path, req?.body?.fileName, req?.body?.caption)
            return res.status(200).json({
                result: 200,
                type: 'file',
                session: req?.body?.session,
                file: name,
                data: response
            })

        } catch (error) {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "log": error
            })
        }
    }

    static async sendAudio(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.mp3 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);

        if (isURL) {
            await get(req.body.path, {
                directory: 'files-received'
            });
            let file = req.body.path.split(/[\/\\]/).pop();
            let name = file.split('.')[0];
            let dir = 'files-received/'
            let ext = file.split('.').pop();

            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {

                    let response = await data.client.sendPtt(number, dir + file)
                    fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                    return res.status(200).json({
                        result: 200,
                        type: 'ptt',
                        session: req.body.session,
                        file: name,
                        data: response
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
        if (!isURL) {
            let file = req.body.path.split(/[\/\\]/).pop();
            let name = file.split('.')[0];
            let ext = file.split('.').pop();
            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {
                    let response = await data.client.sendPtt(number, req.body.path)
                    return res.status(200).json({
                        result: 200,
                        type: 'ptt',
                        session: req.body.session,
                        file: name,
                        data: response
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
    }

    static async sendVoiceBase64(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let base64 = req.body.path;
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path em formato Base64"
            });
        }
        else {
            try {
                let response = await data.client.sendPttFromBase64(number, base64).then((value) => {
                    console.log(value)
                }).catch((err) => {
                    console.log(err)
                })
                return res.status(200).json({
                    result: 200,
                    type: 'audio',
                    messageId: response.id,
                    session: req.body.session,
                    data: response
                })

            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendLink(req, res) {
        let data = Sessions.getSession(req.body.session)
        let isURL = await urlExists(req.body.url);
        let isGroup = req.body.isGroup;
        let number = isGroup === true ? req.body.number + '@g.us' : req.body.number + '@c.us';

        if (!req.body.url) {
            return res.status(400).json({
                status: 400,
                error: "URL não foi informada, é obrigatorio"
            })
        }
        else
            if (!isURL) {
                return res.status(400).json({
                    status: 400,
                    error: "Link informado é invalido"
                })
            }
            else {
                try {
                    let response = await data.client.sendLinkPreview(number, req.body.url, req.body.text)

                    return res.status(200).json({
                        result: 200,
                        type: 'link',
                        messageId: response.id,
                        session: req.body.session,
                        data: response
                    })
                } catch (error) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": error
                    })
                }
            }
    }

    static async sendContact(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.contact) {
            return res.status(400).json({
                status: 400,
                error: "Contact não foi informado"
            })
        }
        else if (!req.body.name) {
            return res.status(400).json({
                status: 400,
                error: "Nome do Contato não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendContactVcard(number, req.body.contact + '@c.us', req.body.name)
                return res.status(200).json({
                    result: 200,
                    type: 'contact',
                    messageId: response.id,
                    session: req.body.session,
                    data: response
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendLocation(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.lat) {
            return res.status(400).json({
                status: 400,
                error: "Latitude não foi informada"
            })
        }
        else if (!req.body.log) {
            return res.status(400).json({
                status: 400,
                error: "Longitude não foi informada"
            })
        }
        if (!req.body.title) {
            return res.status(400).json({
                status: 400,
                error: "Title do endereço não foi informado"
            })
        }
        else if (!req.body.description) {
            return res.status(400).json({
                status: 400,
                error: "Descrição do endereço não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendLocation(number, req.body.lat, req.body.log, `${req.body.title}\n${req.body.description}`)
                return res.status(200).json({
                    result: 200,
                    type: 'locate',
                    messageId: response.id,
                    session: req.body.session,
                    data: response
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async reply(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else if (!req.body.messageid) {
            return res.status(400).json({
                status: 400,
                error: "MessageID não foi informada, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.reply(number, req.body.text, req.body.messageid);
                return res.status(200).json({
                    result: 200,
                    type: 'text',
                    session: req.body.session,
                    messageId: response.id,
                    data: response
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async forwardMessages(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else if (!req.body.messageid) {
            return res.status(400).json({
                status: 400,
                error: "MessageID não foi informado, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.forwardMessages(number, [req.body.messageid]);
                return res.status(200).json({
                    result: 200,
                    type: 'forward',
                    messageId: response.id,
                    session: req.body.session,
                    data: response
                })

            } catch (error) {
                return res.status(200).json({
                    "result": 400,
                    "status": "FAIL",
                    "error": error
                })
            }
        }
    }

    static async getOrderbyMsg(req, res) {
        let data = Sessions.getSession(req.body.session)
        if (!req.body.messageid) {
            return res.status(400).json({
                status: 400,
                error: "MessageID não foi informado, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.getOrderbyMsg(req.body.messageid);
                return res.status(200).json({
                    result: 200,
                    type: 'order',
                    session: req.body.session,
                    data: response
                })

            } catch (error) {
                return res.status(200).json({
                    "result": 400,
                    "status": "FAIL",
                    "error": error
                })
            }
        }
    }

    static async sendListMenu(req, res) {
        const {
            isGroup,
            session,
            number,
            title = '',
            description = '',
            list = [],
        } = req.body

        let data = Sessions.getSession(session)
        let recipient = isGroup === true ? number + '@g.us' : number + '@c.us';

        if (!Array.isArray(list) || list.length == 0) {
            return res.status(400).json({
                status: 400,
                error: "Lista de menus inválidos!"
            })
        }

        try {
            const menus = {
                buttonText: title,
                description,
                sections: list.map((l) => ({ ...l, rows: l.rows.map((r, idx) => ({ ...r, rowId: `id${idx}` })), }))
            }
            let response = await data.client.sendListMessage(recipient, menus)
            // console.dir(menus, { depth: null })
            return res.status(200).json({
                result: 200,
                type: 'list',
                session: req.body.session,
                messageId: response?.id ?? '',
                from: response?.from?.split('@')[0] ?? '',
                to: response?.chatId?.user ?? '',
                content: response?.content ?? ''
            })
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }
    }

    static async sendButtons(req, res) {
        const {
            isGroup,
            session,
            number,
            title = '',
            buttons = [],
            description = '',
        } = req.body

        let data = Sessions.getSession(session)
        let recipient = isGroup === true ? number + '@g.us' : number + '@c.us';

        if (!Array.isArray(buttons) || buttons.length == 0) {
            return res.status(400).json({
                status: 400,
                error: "Lista de botões inválidos!"
            })
        }

        try {
            const buttonsSend = {
                useTemplateButtons: true, // False for legacy
                title,
                footer: '',
                buttons: buttons.map((b, idx) => ({
                    id: b?.buttonId ?? `id@${idx}`,
                    url: b?.buttonUrl ?? undefined,
                    phoneNumber: b?.buttonPhoneNumber ?? undefined,
                    text: b?.buttonTitle ?? ''
                }))
            }
            let response = await data.client.sendText(recipient, description, buttonsSend)

            // console.dir(response, { depth: null })
            return res.status(200).json({
                result: 200,
                type: 'buttons',
                session: req.body.session,
                messageId: response.id,
                from: response.from.split('@')[0],
                to: response.chatId.user,
                content: response.content
            })
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }

    }

    static async sendMessageWithThumb(req, res) {
        const {
            session, number, isGroup, thumb, url, title, description,
        } = req?.body ?? {}
        const data = Sessions.getSession(session)
        const isURL = await urlExists(url);
        const recipient = isGroup === true ? number + '@g.us' : req.body.number + '@c.us';
        // * Validations
        if (!url) {
            return res.status(400).json({
                status: 400,
                error: "URL não foi informada, é obrigatorio"
            })
        }
        if (!isURL) {
            return res.status(400).json({
                status: 400,
                error: "Link informado é invalido"
            })
        }
        if (!thumb) {
            return res.status(400).json({
                status: 400,
                error: "Thumb informado é invalido"
            })
        }
        let response = null
        try {

            /*
            let base64: string = '';

            if (thumb.startsWith('data:')) {
            base64 = thumb;
            } else {
            let fileContent = await downloadFileToBase64(thumb, [
                'image/gif',
                'image/png',
                'image/jpg',
                'image/jpeg',
                'image/webp',
            ]);
            if (!fileContent) {
                fileContent = await fileToBase64(thumb);
            }
            if (fileContent) {
                base64 = fileContent;
            }
            }

            if (!base64) {
            const error = new Error('Empty or invalid file or base64');
            Object.assign(error, {
                code: 'empty_file',
            });
            throw error;
            }

            const mimeInfo = base64MimeType(base64);

            if (!mimeInfo || !mimeInfo.includes('image')) {
            const error = new Error(
                'Not an image, allowed formats png, jpeg, webp and gif'
            );
            Object.assign(error, {
                code: 'invalid_image',
            });
            throw error;
            }

            const thumbnail = base64.replace(
            /^data:image\/(png|jpe?g|webp|gif);base64,/,
            ''
            );

            response = await data.client.sendText(recipient, url, {
                linkPreview: {
                    thumbnail: thumb,
                    canonicalUrl: url,
                    description,
                    matchedText: url,
                    title,
                    richPreviewType: 0,
                    doNotPlayInline: true,
                }
            })
            */

            // ? sendMessageWithThumb(pathOrBase64: string, url: string, title: string, description: string, chatId: string): Promise<SendMessageReturn>
            response = await data.client.sendMessageWithThumb(thumb, url, title, description, recipient)  

            return res.status(200).json({
                result: 200,
                type: 'link_thumb',
                messageId: response?.id ?? 0,
                session: session ?? '',
                data: response ?? {}
            })
        } catch (error) {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "log": error,
                "response": response
            })
        }
    }

}
