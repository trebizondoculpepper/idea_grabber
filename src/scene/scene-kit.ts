import {
  BoxGeometry,
  CanvasTexture,
  BufferGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  NearestFilter,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three';
import type { Object3D } from 'three';
import { createPs1Material } from '../rendering/ps1-material';

export const palette = {
  ink: '#171023',
  yellow: '#ffdf20',
  pink: '#ff38a8',
  teal: '#20dccc',
  purple: '#572299',
  lavender: '#ae8dd9',
  silver: '#b1a9c6',
  white: '#fff9e4',
};

// Scene-local ownership: repeated meshes share resources, disposed once on hot reload.
export function createSceneKit() {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const materialCache = new Map<string, Material>();
  const loader = new TextureLoader();
  const cube = ownGeometry(new BoxGeometry(1, 1, 1));
  const plane = ownGeometry(new PlaneGeometry(1, 1));
  const outlineGeometry = ownGeometry(new EdgesGeometry(cube));
  const outlineMaterial = new LineBasicMaterial({ color: palette.ink });
  materials.add(outlineMaterial);

  function ownGeometry<T extends BufferGeometry>(geometry: T): T {
    geometries.add(geometry);
    return geometry;
  }
  function material(colour: string): Material {
    let result = materialCache.get(colour);
    if (!result) {
      result = createPs1Material({ color: colour });
      materialCache.set(colour, result);
      materials.add(result);
    }
    return result;
  }
  function textured(
    name: string,
    repeatX = 1,
    repeatY = repeatX,
    cutout = false,
  ): Material {
    const key = `${name}:${repeatX}:${repeatY}:${cutout}`;
    let result = materialCache.get(key);
    if (result) return result;
    const map = loader.load(`${import.meta.env.BASE_URL}assets/${name}.svg`);
    map.colorSpace = SRGBColorSpace;
    map.magFilter = map.minFilter = NearestFilter;
    map.generateMipmaps = false;
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    textures.add(map);
    result = createPs1Material(
      { map, side: DoubleSide, alphaTest: cutout ? 0.1 : 0 },
      // Screens, signs and paper characters stay luminous; room surfaces receive the disco lights.
      !(
        name === 'checker-floor' ||
        name === 'backdrop' ||
        name.startsWith('posters/') ||
        name.startsWith('litter/')
      ),
    );
    materialCache.set(key, result);
    materials.add(result);
    return result;
  }
  function emoji(glyph: string): Material {
    const key = `emoji:${glyph}`;
    const cached = materialCache.get(key);
    if (cached) return cached;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = palette.white;
    context.strokeStyle = palette.ink;
    context.lineWidth = 5;
    context.beginPath();
    context.arc(64, 64, 60, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.font =
      '80px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(glyph, 64, 68);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.magFilter = map.minFilter = NearestFilter;
    map.generateMipmaps = false;
    textures.add(map);
    const surface = createPs1Material(
      { map, side: DoubleSide, alphaTest: 0.1 },
      true,
    );
    materials.add(surface);
    materialCache.set(key, surface);
    return surface;
  }
  function group(parent: Object3D, name: string, x = 0, y = 0, z = 0) {
    const node = new Group();
    node.name = name;
    node.position.set(x, y, z);
    parent.add(node);
    return node;
  }
  function box(
    parent: Object3D,
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    colour: string,
    outlined = false,
  ) {
    const node = new Mesh(cube, material(colour));
    node.name = name;
    node.scale.set(...size);
    node.position.set(...position);
    parent.add(node);
    if (outlined) {
      const outline = new LineSegments(outlineGeometry, outlineMaterial);
      outline.name = `${name}Outline`;
      node.add(outline);
    }
    return node;
  }
  function panel(
    parent: Object3D,
    name: string,
    size: [number, number],
    position: [number, number, number],
    surface: Material,
  ) {
    const node = new Mesh(plane, surface);
    node.name = name;
    node.scale.set(size[0], size[1], 1);
    node.position.set(...position);
    parent.add(node);
    return node;
  }
  return {
    group,
    box,
    panel,
    material,
    textured,
    emoji,
    ownGeometry,
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const surface of materials) surface.dispose();
      for (const texture of textures) texture.dispose();
    },
  };
}

export type SceneKit = ReturnType<typeof createSceneKit>;
