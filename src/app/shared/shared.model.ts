export interface Image {
  id: string;
  src: string;
}

export interface Pos {
  posX: number;
  posY: number;
}
export interface Pic {
  id: number;
  picX: number;
  picY: number;
}

export interface Tile {
  id?: number;
  picX?: number;
  picY?: number;
  posX?: number;
  posY?: number;
}
