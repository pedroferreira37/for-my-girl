/** @type {import('./$types').PageServerLoad} */

const getImagesPath = () => {
	const pics = [];
	const paths = import.meta.glob('/static/*.jpeg', {
		eager: true
	});

	let i = 0;
	for (const path in paths) {
		const picPath = paths[path].default.replace('/static/', '');
		pics.push({ id: i, path: picPath });
		i++;
	}

	return pics;
};
export async function load({ params }) {
	const pics = getImagesPath();
	return {
		pics
	};
}
