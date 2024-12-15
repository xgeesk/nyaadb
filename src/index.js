import { Noco } from './noco.js'
import { getDoc, parseListPage, parseItemPage } from './utils.js'

const smol = ({ id, seeders, leechers }) => ({ id, seeders, leechers })

export async function* updatePages(opts) {
	const noco = Noco(opts)
	for (let i = 1; i < 90; ++i) {
		const items = [...parseListPage(await getDoc(`/user/offkab?p=${i}`), true)]
		const ids = items.map((i) => i.id)
		const w = `(id,btw,${Math.min(...ids)},${Math.max(...ids)})`
		const existQuery = await noco.get({ w, f: 'id', l: 100 })
		const haveIds = new Set(existQuery.list.map((i) => i.id))
		const grouped = Map.groupBy(items, (i) => (haveIds.has(i.id) ? 1 : 0))
		const newItems = grouped.get(0) ?? []
		if (newItems.length) await noco.post(newItems)
		const updItems = grouped.get(1) ?? []
		if (updItems.length) await noco.patch(updItems.map(smol))
		yield { page: i, query: w, new: newItems.length, upd: updItems.length }
	}
}

export async function* updateItems(opts) {
	const noco = Noco(opts)
	while (true) {
		const resp = await noco.get({ viewId: opts.view, f: 'id,info' })
		if (!resp.list.length) break
		for (const { id, info } of resp.list) {
			const pg = parseItemPage(await getDoc(`/view/${id}`))
			await noco.patch([
				{ id, ...pg, info: { ...info, ...pg.info } }
			])
			yield { id }
		}
	}
}