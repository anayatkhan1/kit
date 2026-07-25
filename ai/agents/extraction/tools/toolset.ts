import { ToolSet } from "ai";
import { getDocumentMetadataTool } from "./get-document-metadata";
import { documentInformationExtractionTool } from "./document-information-extraction";
import { getSheetMetadataTool } from "./get-sheet-metadata";
import { spreadsheetInformationExtractionTool } from "./spreadsheet-information-extraction";
import { imageInformationExtractionTool } from "./image-information-extraction";
import { saveExtractionTool } from "./save-extraction";

export const extractionToolset = {
  get_document_metadata: getDocumentMetadataTool,
  document_information_extraction: documentInformationExtractionTool,
  get_sheet_metadata: getSheetMetadataTool,
  spreadsheet_information_extraction: spreadsheetInformationExtractionTool,
  image_information_extraction: imageInformationExtractionTool,
  save_extraction: saveExtractionTool,
} as ToolSet;
