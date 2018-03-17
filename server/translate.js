const Translate = require('@google-cloud/translate');
const projectId = 'missionhack-198303'
const translator = new Translate({
	projectId: projectId
});

function translateMsg(msg, lang) {
	let translation = 'unable to translate';

	return translator.translate(msg, lang)
	.then(results => {
		return results;
	})
	.catch(err => {
		console.error('ERROR: ', err);
	});
}

module.exports.translateMsg = translateMsg;