import { Request, Response } from "express"
import { sign, verify } from "jsonwebtoken"
import User from "../model/user"
import Balance from "../model/balance"

const createAccessToken = (id: string) => {
  return sign({ id }, process.env.SECRET_ACCESS_TOKEN!, {
    expiresIn: "7d"
  })
}

export default class API {
  static async getHome(req: Request, res: Response) {
    res.render('home', { title: "Grock VTU | Home" })
  }
  static async getLogin(req: Request, res: Response) {
    res.render('login', { title: "Grock VTU | Login" })
  }
  static async getRegister(req: Request, res: Response) {
    res.render('register', { title: "Grock VTU | Register" })
  }
  static async registerUser(req: Request, res: Response) {
    const body = req.body
    try {
      const user = await User.register(body)
      await Balance.create({ email: user.email })
      const token = createAccessToken(user._id)
      res.cookie('jalabi', token, {
        maxAge: 60 * 60 * 24 * 1000
      })
      res.status(200).json({ ok: true, message: "Registered successfully" })
    } catch (err: any) {
      res.status(201).json({ ok: false, error: err.message })
    }
  }
  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const user = await User.login(email, password)
      const token = createAccessToken(user._id)
      res.cookie('jalabi', token, {
        maxAge: 60 * 60 * 24 * 1000
      })
      res.status(200).json({ ok: true, message: "Logged in successfully" })
    } catch (err: any) {
      res.status(201).json({ ok: false, error: err.message })
    }
  }
  static async logout(req: Request, res: Response) {
    res.cookie("jalabi", "")
    res.redirect('/')
  }
  static async getUserDashboard(req: Request, res: Response) {
    res.render('clients/dashboard', { title: "Grock VTU | Dashboard" })
  }
  static async getUserTransaction(req: Request, res: Response) {
    res.render('clients/transactions', { title: "Grock VTU | Transactions" })
  }
  static async getUserAirtime(req: Request, res: Response) {
    res.render('clients/airtime', { title: "Grock VTU | Airtime" })
  }
  static async getDataBundle(req: Request, res: Response) {
    res.render('clients/data-bundle', { title: "Grock VTU | Data Bundle" })
  }
  static async getCableTV(req: Request, res: Response) {
    res.render('clients/cable-tv', { title: "Grock VTU | Cable Tv" })
  }
  static async getMeterToken(req: Request, res: Response) {
    res.render('clients/meter-token', { title: "Grock VTU | Meter Token" })
  }
  static async get404Page(req: Request, res: Response) {
    res.render('clients/404', { title: "Grock VTU | 404" })
  }
}