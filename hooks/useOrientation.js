import React from "react";
import { useWindowDimensions } from "react-native";

const useOrientation = () => {
	const window = useWindowDimensions();
	const isPortrait = window.height > window.width;

	return isPortrait ? "portrait" : "landscape";
};

export default useOrientation;
