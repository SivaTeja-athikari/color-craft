export interface WallPreviewPlan {
  originalImageUri: string;
  roomType: string;
  paletteId: string;
  mainWallHex: string;
  accentWallHex: string;
  trimHex: string;
  createdAt: number;
}

export interface WallPreviewResult {
  previewImageUri: string;
  disclaimer: string;
  renderMode: 'approximate_overlay' | 'manual_tint' | 'simulated';
}

/**
 * Interface Boundary for future Cloud AI or Native On-Device Image Processing.
 * No AI or segmentation is run today.
 */
export interface IWallColourPreviewEngine {
  generateWallPreview(plan: WallPreviewPlan): Promise<WallPreviewResult>;
}

/**
 * Standard implementation providing an honest, non-fabricated approximate preview
 */
export class ClientApproximatePreviewEngine implements IWallColourPreviewEngine {
  async generateWallPreview(plan: WallPreviewPlan): Promise<WallPreviewResult> {
    return {
      previewImageUri: plan.originalImageUri,
      disclaimer:
        'Approximate color wash preview. Walls and architectural edges are not segmented automatically.',
      renderMode: 'approximate_overlay',
    };
  }
}

export const defaultWallPreviewEngine = new ClientApproximatePreviewEngine();
