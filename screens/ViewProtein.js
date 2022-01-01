import React, { useState } from "react";
import GLViewProtein from "../components/GLViewProtein";
import ViewProteinsLayout from "./layouts/ViewProteinsLayout";

const ViewProteins = ({ route, navigation }) => {
	const ligand = route.params.ligand;
	const [mod, setMod] = useState(1);
	const [zoom, setZoom] = useState(0);

	return (
		<ViewProteinsLayout
			navigation={navigation}
			setMod={setMod}
			setZoom={setZoom}
		>
			<GLViewProtein ligand={ligand} modelisation={mod} zoom={zoom} />
		</ViewProteinsLayout>
	);
};

export default ViewProteins;
