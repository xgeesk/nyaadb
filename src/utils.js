const parser = new DOMParser()

/** @param {string} path */
export const getDoc = async (path) => {
	const r = await fetch(path)
	return parser.parseFromString(await r.text(), 'text/html')
}

/** @param {Document} doc */
export function* parseListPage(doc, full = false) {
	for (const row of doc.querySelectorAll('tr')) {
		const [f, ...td] = row.querySelectorAll('td')
		if (!f) continue
		const tt = td[0].querySelector('a')
		yield {
			id: parseInt(tt.href.split('/').at(-1)),
			seeders: parseInt(td[4].innerText),
			leechers: parseInt(td[5].innerText),
			...(full
				? {
						added: new Date(parseInt(td[3].dataset.timestamp) * 1000),
						title: tt.innerText,
						info: {
							sz: td[2].innerText,
							ml: td[1].querySelector('a:nth-child(2)').href,
						},
				  }
				: null),
		}
	}
}

/** @param {Document} doc */
export const parseItemPage = (doc, full = false) => {
	const [se, le] = doc.querySelectorAll('div > span')
	const ts = doc.querySelector('div[data-timestamp]').dataset.timestamp
	return {
		seeders: parseInt(se.innerText),
		leechers: parseInt(le.innerText),
		...(full
			? {
					added: new Date(parseInt(ts) * 1000),
					title: doc.querySelector('h3.panel-title').innerText,
					info: {
						ml: doc.querySelector('a.card-footer-item').href,
						cid: doc
							.querySelector('#torrent-description')
							.innerText.match(/\n品番：\s*(.+)\s/)?.[1],
					},
			  }
			: null),
	}
}
