import React from "react";
import { Helmet } from "react-helmet";

export const SignalingServer = React.memo(() => {
	return (
		<Helmet>
			<script
				type="text/javascript"
				src="https://cdn.scaledrone.com/scaledrone.min.js"
			/>
		</Helmet>
	);
});
