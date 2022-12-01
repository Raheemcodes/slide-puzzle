export interface Image {
  id: string;
  src: string;
}

export interface Pos {
  posX: number;
  posY: number;
  posId: number;
}
export interface Pic {
  picId: number;
  picX: number;
  picY: number;
}

export interface Tile {
  posId?: number;
  picId?: number;
  picX?: number;
  picY?: number;
  posX?: number;
  posY?: number;
}
