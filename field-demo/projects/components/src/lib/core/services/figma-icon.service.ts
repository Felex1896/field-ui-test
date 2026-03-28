import { Injectable } from '@angular/core';

export interface FigmaNodeRef {
  fileKey: string;
  nodeId: string;
}

@Injectable({ providedIn: 'root' })
export class FigmaIconService {
  /**
   * Parses a Figma design URL and extracts fileKey + nodeId.
   * Supports formats:
   *   https://www.figma.com/design/:fileKey/...?node-id=14-2626
   *   https://www.figma.com/file/:fileKey/...?node-id=14:2626
   */
  parseUrl(url: string): FigmaNodeRef | null {
    try {
      const u = new URL(url);
      if (!u.hostname.includes('figma.com')) return null;

      const parts = u.pathname.split('/').filter(Boolean);
      // pathname: ['design' | 'file', fileKey, ...]
      const typeIdx = parts.findIndex((p) => p === 'design' || p === 'file');
      if (typeIdx === -1 || typeIdx + 1 >= parts.length) return null;

      const fileKey = parts[typeIdx + 1];
      const rawNodeId = u.searchParams.get('node-id');
      if (!rawNodeId) return null;

      // Figma API wants "14:2626" but URLs use "14-2626"
      const nodeId = rawNodeId.replace('-', ':');
      return { fileKey, nodeId };
    } catch {
      return null;
    }
  }

  /**
   * Fetches the SVG export URL for a node from the Figma API,
   * then fetches the SVG content itself and returns it as a string.
   */
  async fetchSvg(ref: FigmaNodeRef, token: string): Promise<string> {
    // Step 1: get the export image URL
    const exportUrl =
      `https://api.figma.com/v1/images/${ref.fileKey}` +
      `?ids=${encodeURIComponent(ref.nodeId)}&format=svg`;

    const exportRes = await fetch(exportUrl, {
      headers: { 'X-Figma-Token': token },
    });

    if (!exportRes.ok) {
      throw new Error(`Figma API error ${exportRes.status}: ${await exportRes.text()}`);
    }

    const exportData = await exportRes.json();
    const svgUrl: string | undefined = exportData?.images?.[ref.nodeId];
    if (!svgUrl) throw new Error('No image URL returned by Figma API');

    // Step 2: fetch the actual SVG file
    const svgRes = await fetch(svgUrl);
    if (!svgRes.ok) throw new Error(`Failed to fetch SVG: ${svgRes.status}`);

    return svgRes.text();
  }
}
