
/**
  MyZAP2.0 API OpenSource
  @codigo escrito em 07/06/2021
  @Author Eduardo Policarpo
 */
import Sessions from '../../controllers/sessions.js';
import get from "async-get-file";
import path from 'path'
import fs from 'fs';
import whatsappweb from "whatsapp-web.js";
const { MessageMedia, Location, Contact } = whatsappweb;
import util from 'util';
import urlExistsImport from 'url-exists';
const urlExists = util.promisify(urlExistsImport);
import moment from 'moment';

export default class Commands {

    static async getContact(req, res) {

        return res.status(400).json({
            "result": 400,
            "status": "FAIL",
            "error": "Not implementd"
        })
        /*
        try {
            const session = req?.body?.session ?? ''
            if (!session) throw new Error(`Session "${session}" is invalid!`)
            const data = Sessions.getSession(session)
            const number = req?.body?.number ?? ''
            const response = await data.client.getContact(number + '@c.us')
            return res.status(200).json({
                ...response,
                "result": 200,
                "messages": "SUCCESS",
            })
        } catch (error) {
            return res.status(400).json({
                "result": 400,
                "status": "FAIL",
                "error": error
            })
        }
        */
    }

}

