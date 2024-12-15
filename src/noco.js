export const Noco = (options) => {
	/** @param {string} path */
	const API = async (path, opts) => {
		const resp = await fetch(`${options.base}/${path}`, {
			...opts,
			headers: {
				'xc-token': options.token,
				...(opts?.body ? { 'content-type': 'application/json' } : null),
				...opts?.headers,
			},
		})
		return await resp.json()
	}

	return {
		raw: API,
		get: (qs) => API(`records?${new URLSearchParams(qs)}`),
		post: (dt) => API('records', { method: 'POST', body: JSON.stringify(dt) }),
		patch: (dt) => API('records', { method: 'PATCH', body: JSON.stringify(dt) })
	}
}