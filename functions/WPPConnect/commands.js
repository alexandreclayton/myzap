
/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../../controllers/sessions.js';
import moment from 'moment';
moment().format('DD-MM-YYYY hh:mm:ss');
moment.locale('pt-br')
export default class Commands {

  static async getBatteryLevel(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getBatteryLevel()
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "batterylevel": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getConnectionState(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getConnectionState()
      return res.status(200).json({
        "result": 200,
        "status": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getHostDevice(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getHostDevice()
      console.log(response)
      return res.status(200).json({
        "result": 200,
        "number": response.wid.user,
        "connected": response.connected,
        "phone": response.phone,
        "plataform": response.plataform,
        "locales": response.locales,
        "batery": response.batery,
        "pushname": response.pushname
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getAllContacts(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getAllContacts()
      let contacts = response.map(function (data) {
        return {
          'name': data.name ? data.name : '',
          'realName': data.pushname ? data.pushname : '',
          'formattedName': data.formattedName ? data.formattedName : '',
          'phone': data.id.user,
          'business': data.isBusiness,
          'verifiedName': data.verifiedName ? data.verifiedName : '',
          'isMyContact': data.isMyContact
        }
      })
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": contacts
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getAllChats(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getAllChats()

      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getAllChatsWithMessages(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getAllChatsWithMessages()

      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getAllNewMessages(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getAllNewMessages()

      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getAllUnreadMessages(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getAllUnreadMessages()

      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getBlockList(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let response = await data.client.getBlockList()
      let blkcontacts = response.map(function (data) {
        return {
          'phone': data ? data.split('@')[0] : '',
        }
      })
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "contacts": blkcontacts
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getMessagesChat(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      let response = await data.client.loadAndGetAllMessagesInChat(number, true)
      let messages = response.map(function (data) {
        // console.log(data)
        return {
          "type": data.type,
          "author": data.verifiedName,
          "from": data.from,
          "to": data.to,
          "mensagem": data.body,
          "enviada em": moment.unix(data.t).format('DD-MM-YYYY hh:mm:ss')
        }
      })
      return res.status(200).json({
        "result": 200,
        "data": messages
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getProfilePic(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      let response = await data.client.getProfilePicFromServer(number)
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "pic_profile": response
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getContact(req, res) {
    try {
      const session = req?.body?.session ?? ''
      if (!session) throw new Error(`Session "${session}" is invalid!`)
      const data = Sessions.getSession(session)
      const number = req?.body?.number ?? ''
      // console.log(`Get Contact to number: ${number}`)
      const response = await data.client.getContact(number + '@c.us')
      console.dir(response, { depth: null })
      const responseStatus = !response ? 400 : 200
      return res.status(responseStatus).json({
        ...response,
        "id": ((response?.id?.user ?? '') + (response?.id?.server ?? '')) ?? '',
        "result": responseStatus,
        "messages": responseStatus == 200 ? "SUCCESS" : "NOT LOCALIZED",
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async verifyNumber(req, res) {
    let data = Sessions.getSession(req.body.session)
    try {
      let number = req.body.number + '@c.us';
      const response = await data.client.checkNumberStatus(number)
      if (response.numberExists) {
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS",
          "server": response.id.server,
          "phone": response.id.user,
          "isBusiness": response.isBusiness,
          "canReceiveMessage": response.canReceiveMessage,
          "profile": response
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "profile": error
      })
    }
  }

  static async deleteChat(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.deleteChat(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async clearChat(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.clearChatMessages(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async archiveChat(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.archiveChat(number, true);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async deleteMessage(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    if (!req.body.messageid) {
      return res.status(400).json({
        status: 400,
        error: "MessageID não foi informada, é obrigatorio"
      })
    }
    else {
      try {
        await data.client.deleteMessage(number, [req.body.messageid], true);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      } catch (error) {
        return res.status(400).json({
          "result": 400,
          "status": "FAIL",
          "error": error
        })
      }
    }
  }

  static async markUnseenMessage(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.markUnseenMessage(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL"
      })
    }
  }

  static async blockContact(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.blockContact(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL"
      })
    }
  }

  static async unblockContact(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      await data.client.unblockContact(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS"
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async getNumberProfile(req, res) {
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@c.us';
    try {
      const response = await data.client.checkNumberStatus(number);
      return res.status(200).json({
        "result": 200,
        "messages": "SUCCESS",
        "server": response.id.server,
        "phone": response.id.user,
        "isBusiness": response.isBusiness,
        "canReceiveMessage": response.canReceiveMessage,
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

}
