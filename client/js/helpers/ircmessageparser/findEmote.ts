import {Part} from "./merge";

const emoteRegexp = /:(\w*):/g;

export type EmotePart = Part & {
	emote: string;
};

function findEmote(text: string) {
	const result: EmotePart[] = [];
	let match: RegExpExecArray | null;

	while ((match = emoteRegexp.exec(text))) {
		result.push({
			start: match.index,
			end: match.index + match[0].length,
			emote: match[0],
		});
	}

	return result;
}

export default findEmote;
