export interface TextElement {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontWeight: string;
  textAlign: string;
  lineHeight: number;
}

export interface TextElementSize {
  width: number;
  height: number;
  fontSize: number;
}

export interface UploadData {
  imageData: string;
  originalImage: string;
  stickers: string[];
}
