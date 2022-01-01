import React from "react";
import GLViewProtein from "../components/GLViewProtein";
import ViewProteinsLayout from "./layouts/ViewProteinsLayout";

const ViewProteins = ({ route }) => {
	const ligand = route.params.ligand;
	return (
		<ViewProteinsLayout>
			<GLViewProtein ligand={ligand} />
		</ViewProteinsLayout>
	);
};

export default ViewProteins;
