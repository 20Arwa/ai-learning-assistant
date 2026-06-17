import fs from "fs"
import { PDFParse } from 'pdf-parse';

const parsePDF = async(file_path) => {
    const parser = new PDFParse({ url: file_path });
	const result = await parser.getText();
    return result.text
}

export default parsePDF

