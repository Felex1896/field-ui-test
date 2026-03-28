import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FigmaIconService } from './figma-icon.service';

describe('FigmaIconService.parseUrl', () => {
  let svc: FigmaIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(FigmaIconService);
  });

  it('parses a /design/ URL with dash node-id', () => {
    const result = svc.parseUrl(
      'https://www.figma.com/design/RuZu30ftgHm89VyOMU8sOp/Vibe-Coding?node-id=14-2626',
    );
    expect(result).toEqual({ fileKey: 'RuZu30ftgHm89VyOMU8sOp', nodeId: '14:2626' });
  });

  it('parses a /file/ URL with colon node-id', () => {
    const result = svc.parseUrl(
      'https://www.figma.com/file/RuZu30ftgHm89VyOMU8sOp/SomeName?node-id=14:2626',
    );
    expect(result).toEqual({ fileKey: 'RuZu30ftgHm89VyOMU8sOp', nodeId: '14:2626' });
  });

  it('returns null when node-id param is missing', () => {
    const result = svc.parseUrl('https://www.figma.com/design/RuZu30ftgHm89VyOMU8sOp/Vibe-Coding');
    expect(result).toBeNull();
  });

  it('returns null for a non-Figma URL', () => {
    expect(svc.parseUrl('https://example.com/design/abc?node-id=1-2')).toBeNull();
  });

  it('returns null for an invalid URL string', () => {
    expect(svc.parseUrl('not a url')).toBeNull();
  });

  it('returns null when pathname has no design/file segment', () => {
    expect(svc.parseUrl('https://www.figma.com/proto/abc?node-id=1-2')).toBeNull();
  });
});
