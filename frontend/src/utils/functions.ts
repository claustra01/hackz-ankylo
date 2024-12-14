import CryptoJS from "crypto-js";

export const generateHash = (input: string): string => {
	const hash = CryptoJS.SHA256(input);
	return hash.toString(CryptoJS.enc.Hex);
};
