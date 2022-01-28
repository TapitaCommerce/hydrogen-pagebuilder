export const randomString = (charCount = 20) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < charCount; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return typeof window !== 'undefined'
		? window.btoa(text + Date.now())
		: text + Date.now();
};

export const listToTree = (list) => {
	const map = {};
	let node;
	const roots = [];
	let i;

	for (i = 0; i < list.length; i += 1) {
		map[list[i].entity_id] = i;
		list[i].children = [];
	}

	for (i = 0; i < list.length; i += 1) {
		node = list[i];
		node.entity_id = parseInt(node.entity_id);
		node.page_id = parseInt(node.page_id);
		node.parent_id = parseInt(node.parent_id);
		node.sort_order = parseInt(node.sort_order);
		node.status = parseInt(node.status);
		try {
			node.dataParsed = JSON.parse(node.data);
			node.stylesParsed = JSON.parse(node.styles);
		} catch (err) {}
		if (node.status) {
			if (node.parent_id !== 0) {
				list[map[node.parent_id]].children.push(node);
			} else {
				roots.push(node);
			}
		}
	}
	return roots;
};
