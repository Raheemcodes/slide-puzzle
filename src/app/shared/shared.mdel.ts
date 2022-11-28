export interface Image {
  id: string;
  src: string;
}

export interface Tile {
  posX: number;
  posY: number;
}
export interface Pic {
  picX: number;
  picY: number;
}

export interface Puz {
  picX?: number;
  picY?: number;
  posX?: number;
  posY?: number;
}
