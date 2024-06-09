import { App } from '@tinyhttp/app'
import no from 'nocodb'

const app = new App()
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'HEAD,GET,POST,OPTIONS')
	res.setHeader('Access-Control-Allow-Credentials', 'true')
	res.setHeader('Access-Control-Allow-Headers', 'xc-auth,content-type')
	if (req.method.toUpperCase() === 'OPTIONS') {
		res.sendStatus(204)
		res.end()
		return
	}
	next()
})
const server = app.listen(8999)
const noco = await no.Noco.init({}, server, app)
app.use(noco)
