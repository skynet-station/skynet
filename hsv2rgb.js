function mix(a, b, v) {
	return (1 - v) * a + v * b;
}

exports.hsv2rgb = function (H, S, V) {
	S = S / 100;
	V = V / 100;
	let V2 = V * (1 - S);
	let r =
		(H >= 0 && H <= 60) || (H >= 300 && H <= 360)
			? V
			: H >= 120 && H <= 240
			? V2
			: H >= 60 && H <= 120
			? mix(V, V2, (H - 60) / 60)
			: H >= 240 && H <= 300
			? mix(V2, V, (H - 240) / 60)
			: 0;
	let g =
		H >= 60 && H <= 180
			? V
			: H >= 240 && H <= 360
			? V2
			: H >= 0 && H <= 60
			? mix(V2, V, H / 60)
			: H >= 180 && H <= 240
			? mix(V, V2, (H - 180) / 60)
			: 0;
	let b =
		H >= 0 && H <= 120
			? V2
			: H >= 180 && H <= 300
			? V
			: H >= 120 && H <= 180
			? mix(V2, V, (H - 120) / 60)
			: H >= 300 && H <= 360
			? mix(V, V2, (H - 300) / 60)
			: 0;

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
};
